using Microsoft.EntityFrameworkCore;
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
    private readonly IMediaBackgroundJobs _mediaBackgroundJobs;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMediaProcessingService _mediaProcessingService;

    public AccountStorageService(IStorageService storageService,  IApplicationDbContext context, IMediaBackgroundJobs mediaBackgroundJobs, ICurrentUserService currentUserService, IMediaProcessingService mediaProcessingService)
    {
        _storageService = storageService;
        _context = context;
        _mediaBackgroundJobs = mediaBackgroundJobs;
        _currentUserService = currentUserService;
        _mediaProcessingService = mediaProcessingService;
    }
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
            ExpiresAt = expiration,
        };

        await _context.Media.AddAsync(media);
        
        await _context.SaveChangesAsync(CancellationToken.None);
        
        var response = new GetPresignedUrlResponse(MediaProvider.S3.ToString(), presignedUrl, "PUT", headers, media.Id, expiration);
        
        return Result<GetPresignedUrlResponse>.Success(response);
    }

    public async Task<Result> SetMediaFileUploaded(SetMediaFileUploadedRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId)) 
            throw new ArgumentNullException(nameof(currentUserId), "CurrentUserId cannot be null or empty!");

        var media = await _context.Media.FirstOrDefaultAsync(x => x.Id == request.MediaId);
        
        if (media is null) return Result.Failure(new NotFoundError("Media not found"));
        
        var uploadedVideo = await _storageService.GetPartialVideoAsync(media.FileName, 0, 1_000_000);

        var tempVideoPath = Path.Combine("wwwroot", "temp", $"{media.FileName}");

        try
        {
            using (var outputFileStream = new FileStream(tempVideoPath, FileMode.Create, FileAccess.Write, FileShare.None))
            {
                await uploadedVideo.Stream.CopyToAsync(outputFileStream);
            }

            using var thumbStream = await _mediaProcessingService.GenerateThumbnailFromFileAsync(tempVideoPath);

            var thumbName = Guid.NewGuid() + ".webp";
            var uploadedThumbnail = await _storageService.UploadAsync(thumbStream, thumbName, "image/webp");

            media.Status = MediaStatus.Uploaded;
            media.ThumbnailFileName = uploadedThumbnail.FileName;
            media.BucketName = uploadedVideo.BucketName;
            media.ExpiresAt = DateTime.UtcNow.AddHours(24);

            await _context.SaveChangesAsync(CancellationToken.None);

            return Result.Success();
        }
        finally
        {
            try
            {
                if (File.Exists(tempVideoPath))
                    File.Delete(tempVideoPath);
            }
            catch
            {
            }
        }
    }
    
    public async Task<IEnumerable<MediaModel>> GetAllMediaFiles()
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var files = await _context.Media.AsNoTracking().Where(x => x.CreatedBy == currentUserId)
            .Select(o => new MediaModel(o.FileName, o.ThumbnailFileName, o.Provider.ToString())).ToListAsync();

        return files;
    }
    
    
    
    
}