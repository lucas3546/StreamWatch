using System.ComponentModel.DataAnnotations;
using HeyRed.Mime;
using Microsoft.EntityFrameworkCore;
using Sqids;
using StreamWatch.Application.Common.Helpers;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class AccountStorageService : IAccountStorageService
{
    private readonly IApplicationDbContext _context;
    private readonly IStorageService _storageService;
    private readonly IBackgroundService _backgroundService;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediaProcessingService _mediaProcessingService;
    private readonly SqidsEncoder<int> _sqids;

    public AccountStorageService(IStorageService storageService,  IApplicationDbContext context, IBackgroundService backgroundService, ICurrentUserService currentUserService, IMediaProcessingService mediaProcessingService, SqidsEncoder<int> squids)
    {
        _storageService = storageService;
        _context = context;
        _backgroundService = backgroundService;
        _currentUserService = currentUserService;
        _mediaProcessingService = mediaProcessingService;
        _sqids = squids;
    }
    
    private static readonly HashSet<string> SupportedImageFormats = new HashSet<string>
    {
        "image/jpg",
        "image/avif",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    };
    public async Task<Result<GetPresignedUrlResponse>> GetPresignedUrl(GetPresignedUrlRequest request)
    {
        var currentUserId = _currentUserService.Id; 
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        var expiration = DateTime.UtcNow.AddMinutes(40);

        var fileName = Guid.NewGuid() + Path.GetExtension(request.FileName);
        
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
        
        var response = new GetPresignedUrlResponse( presignedUrl, "PUT", headers, media.Id, expiration);
        
        return Result<GetPresignedUrlResponse>.Success(response);
    }

    public async Task<Result<UploadImageResponse>> UploadImageAsync(UploadImageRequest request)
    {
        var tempVideoPath = Path.Combine("wwwroot", "temp", $"{request.fileName}");
        
        //TO DO: Add catch.
        try
        {
            using (var outputFileStream = new FileStream(tempVideoPath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await request.Image.CopyToAsync(outputFileStream);
            }

            //Validate video
            var mimetype = MimeGuesser.GuessMimeType(tempVideoPath);
            
            if (!SupportedImageFormats.Contains(mimetype))
            {
                return Result<UploadImageResponse>.Failure(new ValidationError("File format is not supported!"));
            }
        }
        finally
        {
            if (File.Exists(tempVideoPath)) File.Delete(tempVideoPath);
        }

        request.Image.Position = 0;
        //Process and upload thumbnail
        string thumbnailFileName =  "thumb_"+ Guid.NewGuid() + ".webp";
        
        Stream thumbnailStream = _mediaProcessingService.ResizeImage(request.Image, 800, 800);
        
        UploadedFile thumb = await _storageService.UploadAsync(thumbnailStream, thumbnailFileName, "image/webp");

        await thumbnailStream.DisposeAsync();
        
        //Process and upload original file
        string? originalFileName = null;

        UploadedFile?  originalFile = null;
        
        if (!request.UploadOnlyThumbnail)
        {
            originalFileName = Guid.NewGuid() + ".webp";
            
            Stream profilePicStream = _mediaProcessingService.ConvertImageFormat(request.Image);
        
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
        
        var response = new UploadImageResponse(originalFile?.PublicUrl ?? thumb.PublicUrl, thumb.PublicUrl, media.BucketName, media.Size, _sqids.Encode(media.Id), media.ExpiresAt);
        
        return Result<UploadImageResponse>.Success(response);
    }
    
    public async Task<Result> SetMediaFileUploaded(SetMediaFileUploadedRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException(nameof(currentUserId), "CurrentUserId cannot be null or empty!");
        
        var media = await _context.Media.FirstOrDefaultAsync(x => x.Id == request.MediaId);
        
        if (media is null) return Result.Failure(new NotFoundError("Media not found"));

        var objectMetadata = await _storageService.GetFileMetadataAsync(media.FileName);
        
        if (media.Size != objectMetadata.Size)
        {
            return Result.Failure(new ValidationError("File size does not match"));
        }

        if (media.ContentType != objectMetadata.ContentType)
        {
            return Result.Failure(new ValidationError("File content type does not match"));
        }
        
        
        var uploadedVideo = await _storageService.GetPartialVideoAsync(media.FileName, 0, 2_000_000); //2MB
        
        var tempVideoPath = Path.Combine("wwwroot", "temp", $"{media.FileName}");
        
        try
        {
            using (var outputFileStream = new FileStream(tempVideoPath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await uploadedVideo.Stream.CopyToAsync(outputFileStream);
            }
            
            //Validate video
            var mimetype = MimeGuesser.GuessMimeType(tempVideoPath);
            if (mimetype != media.ContentType) return Result.Failure(new ValidationError("File type does not match"));




            using var thumbStream = await _mediaProcessingService.GenerateThumbnailStreamAsync(uploadedVideo.PublicUrl);
                
            
            var thumbName = Guid.NewGuid() + ".webp";
            var uploadedThumbnail = await _storageService.UploadAsync(thumbStream, thumbName, "image/webp");

            media.Status = MediaStatus.Uploaded;
            media.ThumbnailFileName = uploadedThumbnail.FileName;
            media.BucketName = uploadedVideo.BucketName;
            media.ExpiresAt = DateTime.UtcNow.AddHours(24);

            _context.Media.Update(media);

            await _context.SaveChangesAsync(CancellationToken.None);
            
            return Result.Success();
        }
        finally
        {
            if (File.Exists(tempVideoPath)) File.Delete(tempVideoPath);
                
        }
    }
    
    public async Task<IEnumerable<MediaModel>> GetAllMediaFiles()
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var files = await _context.Media.AsNoTracking().Where(x => x.CreatedBy == currentUserId)
            .Select(o => new MediaModel(o.FileName, o.ThumbnailFileName)).ToListAsync();

        return files;
    }


    public async Task<GetStorageOverviewResponse> GetStorageOverview()
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        var medias = await _context.Media.AsNoTracking().Where(x => x.CreatedBy == currentUserId && x.Status == MediaStatus.Uploaded)
            .Select(x => new ExtendedMediaModel(_sqids.Encode(x.Id), _storageService.GetPublicUrl(x.FileName), _storageService.GetPublicUrl(x.ThumbnailFileName), x.Size, x.ExpiresAt)).ToListAsync();


        decimal storageUse = medias.Sum(x => x.Size);

        var response = new GetStorageOverviewResponse(storageUse, medias);

        return response;
    }
    
    
    
}