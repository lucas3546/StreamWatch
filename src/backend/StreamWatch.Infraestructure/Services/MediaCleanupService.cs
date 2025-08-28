using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Enums;
using StreamWatch.Infraestructure.Persistence;

namespace StreamWatch.Infraestructure.Services;

public class MediaCleanupService
{
    private readonly ApplicationDbContext _context;
    private readonly IStorageService _storage;
    private readonly IBackgroundService _backgroundService;
    private readonly ILogger<MediaCleanupService> _logger;

    public MediaCleanupService(ApplicationDbContext context, IStorageService storage, ILogger<MediaCleanupService> logger, IBackgroundService backgroundService)
    {
        _context = context;
        _storage = storage;
        _logger = logger;
        _backgroundService = backgroundService;
    }

    // Master job
    public async Task CleanExpiredFiles()
    {
        var now = DateTime.UtcNow;

        var expiredMedias = await _context.Media
            .Where(x => x.ExpiresAt != null && x.ExpiresAt <= now)
            .Select(x => x.Id)
            .ToListAsync();

        foreach (var mediaId in expiredMedias)
        {
            _backgroundService.Enqueue(() => DeleteMedia(mediaId));
        }
    }
    
    [AutomaticRetry(Attempts = 5, DelaysInSeconds = new[] { 10, 30, 60, 60, 60 })]
    public async Task DeleteMedia(int mediaId)
    {
        var media = await _context.Media.FindAsync(mediaId);
        if (media == null) return;

        try
        {

            if (!string.IsNullOrEmpty(media.FileName))
            {
                try
                {
                    await _storage.DeleteAsync(media.FileName);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Error deleting file");
                }
            }
                

            if (!string.IsNullOrEmpty(media.ThumbnailFileName))
            {
                try
                {
                    await _storage.DeleteAsync(media.ThumbnailFileName);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Error deleting file");
                }
            }

            _context.Media.Remove(media);
            await _context.SaveChangesAsync();
            
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting media {MediaId}", mediaId);
            throw;
        }
    }
}
