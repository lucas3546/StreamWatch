using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sqids;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class BanService : IBanService
{
    private readonly IIdentityService _identityService;
    private readonly IApplicationDbContext _context;
    private readonly SqidsEncoder<int> _sqids;
    private readonly ILogger<BanService> _logger;
    private readonly IBanCacheService _banCacheService;
    private readonly ICurrentUserService _user;
    public BanService(IIdentityService identityService, IApplicationDbContext applicationDbContext, SqidsEncoder<int> sqids, ILogger<BanService> logger, IBanCacheService banCacheService, ICurrentUserService currentUserService)
    {
        _identityService = identityService;
        _context = applicationDbContext;
        _sqids = sqids;
        _logger = logger;
        _banCacheService = banCacheService;
        _user = currentUserService;
    }
    public async Task<Result<string>> BanAsync(BanAccountRequest request)
    {
        var user = await _identityService.FindUserByUserByIdAsync(request.TargetUserId);

        if (user is null) return Result<string>.Failure(new NotFoundError("UserNotFound", "User not found"));

        var activeBan = await _context.Bans.FirstOrDefaultAsync(x => x.IsExpired != true);
        if(activeBan != null)
        {
            return Result<string>.Failure(new ValidationError("UserHasActiveBan", "This user already has an active ban"));
        }

        var ban = new Ban()
        {
            Account = user,
            AccountId = user.Id,
            PrivateReason = request.PrivateReason,
            PublicReason = request.PublicReason,
            ExpirationTime = request.ExpiresAt,
            IpAddress = user.IpAddress,
            IsExpired = false
        };

        await _context.Bans.AddAsync(ban);

        await _context.SaveChangesAsync(CancellationToken.None);

        await _banCacheService.BanAccountIdAsync(user.Id);

        await _banCacheService.BanIpAsync(user.IpAddress);

        _logger.LogInformation("New ban created for UserId={UserId} and the ip, by the Moderator={moderatorId}", user.Id, _user.Id);

        return Result<string>.Success(_sqids.Encode(ban.Id));
    }

    public async Task<Result> UnbanAsync(string accountId)
    {
        var ban = await _context.Bans.Where(x => x.IsExpired != true).FirstOrDefaultAsync(x => x.AccountId == accountId);

        if (ban is null) return Result.Failure(new NotFoundError("NotFound", "Active ban not found for this account"));

        ban.IsExpired = true;

        _context.Bans.Update(ban);

        await _context.SaveChangesAsync(CancellationToken.None);

        _logger.LogInformation("Active ban deleted from database, Id={BanId} by the Moderator={moderatorId}", ban.Id, _user.Id);

        await _banCacheService.UnbanAccountIdAsync(accountId);

        await _banCacheService.UnbanIpAsync(ban.IpAddress);

        _logger.LogInformation("AccountId={AccountId} and Ip Address={IP} removed from cache", accountId, ban.IpAddress);


        return Result.Success();
    }

    public async Task<Result<GetActiveBanForCurrentUserResponse>> GetActiveBanForCurrentUser()
    {
        ArgumentException.ThrowIfNullOrEmpty(_user.IpAddress);

        ArgumentException.ThrowIfNullOrEmpty(_user.Id);

        var ban = await _context.Bans.FirstOrDefaultAsync(x => x.AccountId == _user.Id && x.IsExpired == false || x.IpAddress == _user.IpAddress && x.IsExpired == false);

        if (ban is null) return Result<GetActiveBanForCurrentUserResponse>.Failure(new NotFoundError("NotFound", "Ban not found"));

        var response = new GetActiveBanForCurrentUserResponse(_sqids.Encode(ban.Id), ban.PublicReason, ban.ExpirationTime);

        return Result<GetActiveBanForCurrentUserResponse>.Success(response);
    }
    
    public async Task<IEnumerable<GetBansHistoryFromUserItemResponse>> GetBansHistoryFromUser(string accountId)
{
    var bans = await _context.Bans
        .AsNoTracking()
        .Where(x => x.AccountId == accountId)
        .Select(x => new GetBansHistoryFromUserItemResponse(
            _sqids.Encode(x.Id),
            x.AccountId,
            x.PrivateReason,
            x.PublicReason,
            x.ExpirationTime,
            x.IsExpired,
            x.CreatedAt.ToString()
        ))
        .ToListAsync();



    return bans;
}

    public async Task GetBanInfoAsync(string banId)
    {
        throw new NotImplementedException();
    }


}
