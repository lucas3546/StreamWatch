using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;

namespace StreamWatch.Application.Services;

public class FriendshipService
{
    private readonly ICurrentUserService _currentUserService;

    public FriendshipService(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }
    
    public async Task<Result> SendInvitationAsync(string userName)
    {
        return Result.Success();
    }
}