using System;
using Amazon.Runtime.Internal.Util;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Services;

public class BanUpdateJob
{
    private readonly IApplicationDbContext _context;
    private readonly IBanCacheService _banCacheService;
    private readonly ILogger<BanUpdateJob> _logger;
    public BanUpdateJob(IApplicationDbContext context, IBanCacheService banCacheService,ILogger<BanUpdateJob> logger)
    {
        _context = context;
        _banCacheService = banCacheService;
        _logger = logger;
        
    }
    public async Task UpdateBans()
    {
        _logger.LogInformation("Starting bans update");

        var bans = (await _context.Bans
            .AsNoTracking()
            .Where(x => x.IsExpired == false)
            .Select(x => new { x.AccountId, x.IpAddress })
            .ToListAsync())
            .Select(x => (x.AccountId, x.IpAddress));

        await _banCacheService.OverwriteBannedUsersAsync(bans);

        _logger.LogInformation("Bans updated, Bans={BansCount} setted", bans.Count());
    }
}
