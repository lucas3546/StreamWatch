using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Errors;
using Microsoft.AspNetCore.Identity;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Services;

public class FriendshipService : IFriendshipService
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;
    private readonly IFriendshipRepository _friendshipRepository;
    
    public FriendshipService(ICurrentUserService currentUserService, IIdentityService identityService, IFriendshipRepository friendshipRepository)
    {
        _currentUserService = currentUserService;
        _identityService = identityService;
        _friendshipRepository = friendshipRepository;
    }
    
    public async Task<Result> SendInvitationAsync(string userName)
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        var user = await _identityService.FindUserByUserNameAsync(userName);
        if(user is null) return Result.Failure(new NotFoundError("The User does not exist!"));

        var friendship = await _friendshipRepository.GetFriendshipByIdsAsync(currentUserId, user.Id);
        if (friendship is not null) return Result.Failure(new ValidationError($"The users already has a relationship! Status: {friendship.Status.ToString()}"));

        var newFriendship = new Friendship
        {
            AddresseeId = user.Id,
            RequesterId = currentUserId,
            Status = FriendshipStatus.Pending,
            RequestDate = DateTime.UtcNow,
        };
        
        await _friendshipRepository.AddAsync(newFriendship);
        
        return Result.Success();
    }
}