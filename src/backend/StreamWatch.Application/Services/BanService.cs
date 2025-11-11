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

        _logger.LogInformation("New ban created for UserId={UserId} and the ip", user.Id);

        return Result<string>.Success(_sqids.Encode(ban.Id));
    }

    public async Task<Result> UnbanAsync(string TargetUserId)
    {
        throw new NotImplementedException();
    }
    
    public async Task<Result<GetActiveBanForCurrentUserResponse>> GetActiveBanForCurrentUser()
    {
        ArgumentException.ThrowIfNullOrEmpty(_user.Id);

        var ban = await _context.Bans.FirstOrDefaultAsync(x => x.AccountId == _user.Id && x.IsExpired == false);

        if (ban is null) return Result<GetActiveBanForCurrentUserResponse>.Failure(new NotFoundError("NotFound", "Ban not found"));

        var response = new GetActiveBanForCurrentUserResponse(_sqids.Encode(ban.Id), ban.PublicReason, ban.ExpirationTime);

        return Result<GetActiveBanForCurrentUserResponse>.Success(response);
    }

    public async Task GetBanInfoAsync(string banId)
    {
        throw new NotImplementedException();
    }


}
