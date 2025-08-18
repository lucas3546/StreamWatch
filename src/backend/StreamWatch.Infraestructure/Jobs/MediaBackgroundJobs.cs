using Hangfire;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;

namespace StreamWatch.Infraestructure.Jobs;

public class MediaBackgroundJobs : IMediaBackgroundJobs
{
    private readonly IApplicationDbContext _context;
    private readonly IStorageService _storageService;
    private readonly IMediaProcessingService _mediaProcessingService;

    public MediaBackgroundJobs(IApplicationDbContext context, IStorageService storageService, IMediaProcessingService mediaProcessingService)
    {
        _context = context;
        _storageService = storageService;
        _mediaProcessingService = mediaProcessingService;
    }
    
    [AutomaticRetry(Attempts = 5, DelaysInSeconds = new[] { 10, 30, 60, 60, 60 })]
    public async Task WaitForFileAndCreateMedia(string fileName, string accountId, DateTime expiracy)
    {
        var file = await _storageService.GetPartialVideoAsync(fileName, 0, 1000000); //0 to 1MB
        
        var tempVideoPath = Path.Combine("wwwroot", "temp", $"{fileName}");
        
        using (var outputFileStream = new FileStream(tempVideoPath, FileMode.Create, FileAccess.Write))
        {
            await file.Stream.CopyToAsync(outputFileStream);
        }
        
        var thumbnail = await _mediaProcessingService.GenerateThumbnailFromFileAsync(tempVideoPath);

        string thumbnailName = Guid.NewGuid() + ".webp";

        try
        {
            var save = await _storageService.UploadAsync(thumbnail, thumbnailName, "image/webp");
            
            System.IO.File.Delete(tempVideoPath);
        }
        catch (Exception)
        {
            System.IO.File.Delete(tempVideoPath);
            throw;
        }
        
        var media = new Media
        {
            FileName = file.FileName,
            ThumbnailFileName = thumbnailName,
            BucketName = file.BucketName,
            Provider = file.Provider,
            ExpiresAt = expiracy,
            CreatedBy = accountId,
        };

        await _context.Media.AddAsync(media); 
        
        await _context.SaveChangesAsync(CancellationToken.None);
    }

}