using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Errors;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Extensions;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Services;

public class FriendshipService : IFriendshipService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;
    private readonly IEventBus _eventBus;
    
    public FriendshipService(IApplicationDbContext context,ICurrentUserService currentUserService, IIdentityService identityService, IEventBus eventBus)
    {
        _context = context;
        _currentUserService = currentUserService;
        _identityService = identityService;
        _eventBus = eventBus;
    }
    
    public async Task<Result> SendFriendshipInvitationAsync(SendFriendshipInvitationRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        if(currentUserId.Equals(request.UserName)) return Result.Failure(new ValidationError("You cannot send a friend request to yourself."));
        
        var user = await _identityService.FindUserByUserNameAsync(request.UserName);
        if(user is null) return Result.Failure(new NotFoundError("The User does not exist!"));

        var friendship = await _context.Friendships.Involving(currentUserId, user.Id).FirstOrDefaultAsync();
        if (friendship is not null) return Result.Failure(new ValidationError($"The users already has a relationship! Status: {friendship.Status.ToString()}"));

        var newFriendship = new Friendship
        {
            AddresseeId = user.Id,
            RequesterId = currentUserId,
            Status = FriendshipStatus.Pending,
            RequestDate = DateTime.UtcNow,
        };
        
        await _context.Friendships.AddAsync(newFriendship);

        await _context.SaveChangesAsync(CancellationToken.None);
        
        await _eventBus.PublishAsync(new FriendshipCreatedEvent(newFriendship.RequesterId, newFriendship.AddresseeId));
        
        return Result.Success();
    }

    /*
    public async Task<Result> GetFriendsAsync()
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        var friendships = _friendshipRepository.GetActiveFriendshipsFromUserAsync(currentUserId);
        
        
        
    }

*/
    public async Task<Result> AcceptFriendshipInvitationAsync(AcceptFriendshipInvitationRequest request)
    {
        var currentUserId = _currentUserService.Id; // Addressee
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        var requester = await _identityService.FindUserByUserNameAsync(request.UserName);
        if(requester is null) return Result.Failure(new NotFoundError("The addressee does not exist!"));
        
        
        var friendship = await _context.Friendships.Between(currentUserId, requester.Id).WithStatus(FriendshipStatus.Pending).FirstOrDefaultAsync();
        if(friendship is null) return Result.Failure(new NotFoundError("Friendship pending invitation does not exist!"));
        
        friendship.Status = FriendshipStatus.Accepted;

        _context.Friendships.Update(friendship);
    
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return Result.Success();
    }
    
    public async Task<Result> DeclineFriendshipInvitationAsync(DeclineFriendInvitationRequest request)
    {
        var currentUserId = _currentUserService.Id; // Addressee
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        var requester = await _identityService.FindUserByUserNameAsync(request.UserName);
        if(requester is null) return Result.Failure(new NotFoundError("The addressee does not exist!"));

        var friendship = await _context.Friendships.Between(currentUserId, requester.Id).WithStatus(FriendshipStatus.Pending).FirstOrDefaultAsync();
        if(friendship is null) return Result.Failure(new NotFoundError("Friendship pending invitation does not exist!"));
        
        _context.Friendships.Remove(friendship);
    
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return Result.Success();
    }
    
    public async Task<Result> RemoveFriendAsync(RemoveFriendRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        var user = await _identityService.FindUserByUserNameAsync(request.UserName);
        if(user is null) return Result.Failure(new NotFoundError("The User does not exist!"));

        var friendship = await _context.Friendships.Involving(currentUserId, user.Id).FirstOrDefaultAsync();
        if(friendship is null) return Result.Failure(new NotFoundError("Friendship does not exist!"));
        
        if(friendship.Status != FriendshipStatus.Accepted) return Result.Failure(new ValidationError($"The user is not your friend!"));
        
        _context.Friendships.Remove(friendship);
    
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return Result.Success();
    }
}