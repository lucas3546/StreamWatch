using System.ComponentModel.DataAnnotations;
using HeyRed.Mime;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sqids;
using StreamWatch.Application.Common.Helpers;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Constants;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Errors;
using StreamWatch.Core.Options;

namespace StreamWatch.Application.Services;

public class AccountStorageService : IAccountStorageService
{
    private readonly IApplicationDbContext _context;
    private readonly IStorageService _storageService;
    private readonly IBackgroundService _backgroundService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediaProcessingService _mediaProcessingService;
    private readonly ILogger<AccountStorageService> _logger;
    private readonly SqidsEncoder<int> _sqids;
    private readonly IOptions<S3StorageOptions> _options;

    public AccountStorageService(IStorageService storageService,  IApplicationDbContext context, IBackgroundService backgroundService, ICurrentUserService currentUserService, IMediaProcessingService mediaProcessingService, SqidsEncoder<int> squids, ILogger<AccountStorageService> logger, IOptions<S3StorageOptions> options)
    {
        _storageService = storageService;
        _context = context;
        _backgroundService = backgroundService;
        _currentUserService = currentUserService;
        _mediaProcessingService = mediaProcessingService;
        _sqids = squids;
        _logger = logger;
        _options = options;
    }
    
    public async Task<Result<GetPresignedUrlResponse>> GetPresignedUrl(GetPresignedUrlRequest request)
    {
        ArgumentException.ThrowIfNullOrEmpty(_currentUserService.Id);

        var usedStorage = await _context.Media.Where(x => x.CreatedBy == _currentUserService.Id && x.Status == MediaStatus.Uploaded).SumAsync(x => x.Size);

        if(usedStorage > _options.Value.LimitUsagePerUser) return Result<GetPresignedUrlResponse>.Failure(new ValidationError("LimitUserStorageExceeded","You don't have enough storage space."));

        var expiration = DateTime.UtcNow.AddMinutes(40);

        var fileName = Path.GetFileNameWithoutExtension(request.FileName) + $"_{new Random().Next(1, 1000000)}" + Path.GetExtension(request.FileName);

        var contentType = ContentTypeHelper.GetContentType(fileName);

        var presignedUrl = await _storageService.GetPresignedUrl(fileName, contentType, expiration);

        var headers = new Dictionary<string, string>()
        {
            ["Content-Type"] = contentType
        };

        var media = new Media()
        {
            FileName = fileName,
            ThumbnailFileName = "",
            Status = MediaStatus.Pending,
            Size = request.Size,
            ContentType = contentType,
            ExpiresAt = expiration,
        };

        await _context.Media.AddAsync(media);

        await _context.SaveChangesAsync(CancellationToken.None);

        var response = new GetPresignedUrlResponse(presignedUrl, "PUT", headers, media.Id, expiration);

        _logger.LogInformation("Generated presigned url for User={userId}", _currentUserService.Id);

        return Result<GetPresignedUrlResponse>.Success(response);
    }
    


    public async Task<Result<UploadImageResponse>> UploadImageAsync(UploadImageRequest request)
    {
        var tempVideoPath = Path.Combine("wwwroot", "temp", $"{request.fileName}");
        
        try
        {
            using (var outputFileStream = new FileStream(tempVideoPath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await request.Image.CopyToAsync(outputFileStream);
            }

            //Validate video
            var mimetype = MimeGuesser.GuessMimeType(tempVideoPath);
            
            if (!SupportedImageFormats.Values.Contains(mimetype))
            {
                return Result<UploadImageResponse>.Failure(new ValidationError("File format is not supported!"));
            }
        }
        catch(Exception ex)
        {
            _logger.LogError(ex, "Some error has ocurred when processing image");

            return Result<UploadImageResponse>.Failure(new UnexpectedError("Some error has ocurred when processing image"));
        }
        finally
        {
            if (File.Exists(tempVideoPath)) File.Delete(tempVideoPath);
        }

        request.Image.Position = 0;
        //Process and upload thumbnail
        string thumbnailFileName =  "thumb_"+ Guid.NewGuid() + ".webp";

        Stream thumbnailStream;
        
        if (request.contentType == "image/gif" || request.contentType == "image/webp")
        {
            thumbnailStream = await _mediaProcessingService.GenerateThumbnailFromImageAsync(request.Image, true);
        }
        else
        {
            thumbnailStream = await  _mediaProcessingService.GenerateThumbnailFromImageAsync(request.Image);
        }
        
        UploadedFile thumb = await _storageService.UploadAsync(thumbnailStream, thumbnailFileName, "image/webp");

        await thumbnailStream.DisposeAsync();
        
        //Process and upload original file
        string? originalFileName = null;

        UploadedFile?  originalFile = null;
        
        if (!request.UploadOnlyThumbnail)
        {
            originalFileName = Guid.NewGuid() + ".webp";

            Stream profilePicStream = await _mediaProcessingService.GenerateThumbnailFromImageAsync(request.Image);;
            
            
            originalFile = await _storageService.UploadAsync(profilePicStream, originalFileName, "image/webp");

            await profilePicStream.DisposeAsync();
        }
        
        //Save in database 
        var media = new Media
        {
            FileName = originalFileName ??  thumbnailFileName,
            ThumbnailFileName = thumb.FileName,
            Size = Convert.ToDecimal(originalFile?.Size ?? thumb.Size),
            BucketName = thumb.BucketName,
            ContentType = thumb.ContentType,
            ExpiresAt = request.ExpiresAt,
            Status = MediaStatus.Uploaded
        };
        
        await _context.Media.AddAsync(media);
        
        await _context.SaveChangesAsync(CancellationToken.None);
        
        var response = new UploadImageResponse(originalFile?.PublicUrl ?? thumb.PublicUrl, thumb.PublicUrl, media.BucketName, media.Size, media.Id, media.ExpiresAt);
        
        return Result<UploadImageResponse>.Success(response);
    }


    
    public async Task<Result> SetMediaFileUploaded(SetMediaFileUploadedRequest request)
    {
        ArgumentException.ThrowIfNullOrEmpty(_currentUserService.Id);

        var media = await _context.Media.FirstOrDefaultAsync(x => x.Id == request.MediaId);

        if (media is null) return Result.Failure(new NotFoundError("Media not found"));
        
        //Validate metadata
        var objectMetadata = await _storageService.GetFileMetadataAsync(media.FileName);

        if (media.Size != objectMetadata.Size)
            return Result.Failure(new ValidationError("File size does not match"));

        if (media.ContentType != objectMetadata.ContentType)
            return Result.Failure(new ValidationError("File content type does not match"));

        var tempVideoPath = Path.Combine("wwwroot", "temp", media.FileName);

        UploadedFile? uploadedVideo;

        try
        {
            // Download partial file
            uploadedVideo = await _storageService.GetPartialVideoAsync(media.FileName, 0,  2_000_000); //2mb
                
                
            if (uploadedVideo is null || uploadedVideo?.Stream is null)
                return Result.Failure(new NotFoundError("The video has not been found"));

            // Save temp file
            await using (var fs = new FileStream(
                tempVideoPath,
                FileMode.Create,
                FileAccess.Write,
                FileShare.None))
            {
                await uploadedVideo.Stream.CopyToAsync(fs);
            }

            // Validate mimetype
            var mimeType = MimeGuesser.GuessMimeType(tempVideoPath);
            if (mimeType != media.ContentType)
            {
                await _storageService.DeleteAsync(media.FileName);
                return Result.Failure(new ValidationError("File type does not match"));
            }

            // Generate thumbnail
            await using var thumbStream =
                await _mediaProcessingService.GenerateThumbnailFromVideoUrlAsync(
                    uploadedVideo.PublicUrl);

            var thumbName = $"{Guid.NewGuid()}.webp";

            var uploadedThumbnail = await _storageService.UploadAsync(thumbStream, thumbName, "image/webp");
                

            // Update media
            media.Status = MediaStatus.Uploaded;
            media.ThumbnailFileName = uploadedThumbnail.FileName;
            media.BucketName = uploadedVideo.BucketName;
            media.ExpiresAt = DateTime.UtcNow.AddHours(24);

            _context.Media.Update(media);

            await _context.SaveChangesAsync(CancellationToken.None);

            _logger.LogInformation("The Media={mediaId} has been marked as uploaded, by the User={userId}", media.Id, _currentUserService.Id);

            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while processing uploaded media");
            return Result.Failure(new UnexpectedError("Error processing media file"));
        }
        finally
        {
            if (File.Exists(tempVideoPath))
                File.Delete(tempVideoPath);
        }
    }

    
    public async Task<IEnumerable<MediaModel>> GetAllMediaFiles()
    {
        ArgumentException.ThrowIfNullOrEmpty(_currentUserService.Id);

        var files = await _context.Media.AsNoTracking().Where(x => x.CreatedBy == _currentUserService.Id)
            .Select(o => new MediaModel(o.FileName, o.ThumbnailFileName)).ToListAsync();

        var videoFiles = files.Where(f => ContentTypeHelper.IsVideo(f.FileName)).ToList();
        
        return videoFiles;
    }

    public async  Task<Result> RemoveMedia(Guid mediaId)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(_currentUserService.Id);

        var media = await _context.Media.FirstOrDefaultAsync(x => x.Id == mediaId);

        if(media is null) return Result.Failure(new NotFoundError("NotFound", "Media not found"));

        if (
            _currentUserService.Id != media.CreatedBy &&
            _currentUserService.Role != Roles.Admin &&
            _currentUserService.Role != Roles.Mod
        )
        {
            return Result.Failure(
                new NotFoundError("NotFound", "Media not found")
            );
        }
        
        _backgroundService.Enqueue(() => _storageService.DeleteAsync(media.FileName));

        _backgroundService.Enqueue(() => _storageService.DeleteAsync(media.ThumbnailFileName));

        _context.Media.Remove(media);

        await _context.SaveChangesAsync(CancellationToken.None);

        _logger.LogInformation("Media removed by user, MediaId={id}", mediaId);

        return Result.Success();
    }


    public async Task<GetStorageOverviewResponse> GetStorageOverview()
    {
        ArgumentNullException.ThrowIfNullOrEmpty(_currentUserService.Id);

        var medias = await _context.Media.AsNoTracking().Where(x => x.CreatedBy == _currentUserService.Id && x.Status == MediaStatus.Uploaded).ToListAsync();

        var filteredMedias = medias.Where(f => ContentTypeHelper.IsVideo(f.FileName)).ToList();

        var videoFiles = filteredMedias.Select(x => new ExtendedMediaModel(x.Id, _storageService.GetPublicUrl(x.FileName), _storageService.GetPublicUrl(x.ThumbnailFileName), x.Size, x.ExpiresAt));

        decimal storageUse = videoFiles.Sum(x => x.Size);

        var response = new GetStorageOverviewResponse(storageUse, videoFiles);

        return response;
    }
    
    public async Task<GetUserFullStorageOverviewResponse> GetUserFullStorageOverview(string accountId)
    {
        var medias = await _context.Media.AsNoTracking().Where(x => x.CreatedBy == accountId && x.Status == MediaStatus.Uploaded).ToListAsync();

        var files = medias.Select(x => new ExtendedMediaModel(x.Id, _storageService.GetPublicUrl(x.FileName), _storageService.GetPublicUrl(x.ThumbnailFileName), x.Size, x.ExpiresAt));

        decimal storageUse = files.Sum(x => x.Size);

        var response = new GetUserFullStorageOverviewResponse(storageUse, files);

        return response;
    }
    
    
    
}