using Hangfire;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Entities;

namespace StreamWatch.Infraestructure.Jobs;

public class MediaBackgroundJobs : IMediaBackgroundJobs
{
    private readonly IApplicationDbContext _context;
    private readonly IStorageService _storageService;

    public MediaBackgroundJobs(IApplicationDbContext context, IStorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }
    
    [AutomaticRetry(Attempts = 5, DelaysInSeconds = new[] { 10, 30, 60, 60, 60 })]
    public async Task WaitForFileAndCreateMedia(string fileName, string accountId, DateTime expiracy)
    {
        var file = await _storageService.GetFileMetadataAsync(fileName);
        
        var media = new Media
        {
            FileName = file.FileName,
            ThumbnailFileName = "",
            BucketName = file.BucketName,
            Provider = file.Provider,
            ExpiresAt = expiracy,
            CreatedBy = accountId,
        };

        await _context.Media.AddAsync(media);
        
        await _context.SaveChangesAsync(CancellationToken.None);
    }
}