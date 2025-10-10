using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class FriendshipService : IFriendshipService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IIdentityService _identityService;
    private readonly IStorageService _storageService;
    private readonly IEventBus _eventBus;

    public FriendshipService(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        IIdentityService identityService,
        IStorageService storageService,
        IEventBus eventBus
    )
    {
        _context = context;
        _currentUserService = currentUserService;
        _identityService = identityService;
        _storageService = storageService;
        _eventBus = eventBus;
    }

    public async Task<Result<GetFriendshipStatusResponse>> GetFriendshipStatusAsync(string userId)
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId))
            throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        if(userId == currentUserId) return Result<GetFriendshipStatusResponse>.Failure(new ValidationError("You can't get status by yourself"));

        var friendship = await _context.Friendships.Involving(userId, currentUserId).FirstOrDefaultAsync();

        if (friendship is null) return Result<GetFriendshipStatusResponse>.Failure(new NotFoundError("Friendship not found"));

        return Result<GetFriendshipStatusResponse>.Success(new GetFriendshipStatusResponse(friendship.Status, friendship.RequestDate, friendship.ResponseDate, friendship.RequesterId));
    }

    public async Task<Result> SendFriendshipInvitationAsync(string targetUserId)
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId))
            throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var currentUserName = _currentUserService.Name;
        if (string.IsNullOrEmpty(currentUserName))
            throw new ArgumentNullException("currentUserName cannot be null or empty!");

        if (currentUserId.Equals(targetUserId))
            return Result.Failure(
                new ValidationError("You cannot send a friend request to yourself.")
            );

        var user = await _identityService.FindUserByUserByIdAsync(targetUserId);
        if (user is null)
            return Result.Failure(new NotFoundError("The User does not exist!"));

        var friendship = await _context
            .Friendships.Involving(currentUserId, user.Id)
            .FirstOrDefaultAsync();

        if (friendship is not null)
            return Result.Failure(
                new ValidationError(
                    $"The users already has a relationship! Status: {friendship.Status.ToString()}"
                )
            );

        var newFriendship = new Friendship
        {
            ReceiverId = user.Id,
            RequesterId = currentUserId,
            Status = FriendshipStatus.Pending,
            RequestDate = DateTime.UtcNow,
        };

        await _context.Friendships.AddAsync(newFriendship);

        await _context.SaveChangesAsync(CancellationToken.None);

        await _eventBus.PublishAsync(
            new FriendshipCreatedEvent(newFriendship.RequesterId, currentUserName, newFriendship.ReceiverId)
        );

        return Result.Success();
    }

    public async Task<Result<IEnumerable<FriendModel>>> GetAllFriendsAsync()
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId))
            throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var friends = await _context.Friendships
            .AsNoTracking()
            .Where(f => f.ReceiverId == currentUserId || f.RequesterId == currentUserId)
            .Select(f => f.ReceiverId == currentUserId
                ? new FriendModel(
                    f.RequesterId,
                    f.Requester.UserName,
                    f.Requester.ProfilePic != null ? _storageService.GetPublicUrl(f.Requester.ProfilePic.ThumbnailFileName) : null,
                    f.RequesterId,
                    f.Status.ToString(),
                    f.RequestDate,
                    f.ResponseDate
                )
                : new FriendModel(
                    f.ReceiverId,
                    f.Receiver.UserName,
                    f.Receiver.ProfilePic != null ? _storageService.GetPublicUrl(f.Receiver.ProfilePic.ThumbnailFileName) : null,
                    f.RequesterId,
                    f.Status.ToString(),
                    f.RequestDate,
                    f.ResponseDate
                )
            )
            .ToListAsync();


        return Result<IEnumerable<FriendModel>>.Success(friends);
    }


    public async Task<Result<PaginatedList<FriendModel>>> GetPagedFriendsAsync(
        GetPagedFriendsRequest request
    )
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId))
            throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var friends = await _context
            .Friendships.AsNoTracking()
            .FromUser(currentUserId)
            .WithStatus(FriendshipStatus.Accepted)
            .Where(f => f.ReceiverId != currentUserId || f.RequesterId != currentUserId)
            .GetPaged(request.PageNumber, request.PageSize)
            .Select(f => f.ReceiverId == currentUserId
                ? new FriendModel(
                    f.RequesterId,
                    f.Requester.UserName,
                    f.Requester.ProfilePic != null ? _storageService.GetPublicUrl(f.Requester.ProfilePic.ThumbnailFileName) : null,
                    f.RequesterId,
                    f.Status.ToString(),
                    f.RequestDate,
                    f.ResponseDate
                )
                : new FriendModel(
                    f.ReceiverId,
                    f.Receiver.UserName,
                    f.Receiver.ProfilePic != null ? _storageService.GetPublicUrl(f.Receiver.ProfilePic.ThumbnailFileName) : null,
                    f.RequesterId,
                    f.Status.ToString(),
                    f.RequestDate,
                    f.ResponseDate
                )
            )
            .ToListAsync();

        var totalItems = await _context.Notifications.CountAsync();

        var response = new PaginatedList<FriendModel>(
            friends,
            request.PageNumber,
            request.PageSize,
            totalItems
        );

        return Result<PaginatedList<FriendModel>>.Success(response);
    }

    public async Task<Result> AcceptFriendshipInvitationAsync(string requesterId)
    {
        var currentUserId = _currentUserService.Id; // Addressee
        if (string.IsNullOrEmpty(currentUserId))
            throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var requester = await _identityService.FindUserByUserByIdAsync(requesterId);
        if (requester is null)
            return Result.Failure(new NotFoundError("The addressee does not exist!"));

        var friendship = await _context
            .Friendships.Between(currentUserId, requester.Id)
            .WithStatus(FriendshipStatus.Pending)
            .FirstOrDefaultAsync();
        if (friendship is null)
            return Result.Failure(
                new NotFoundError("Friendship pending invitation does not exist!")
            );

        friendship.Status = FriendshipStatus.Accepted;
        friendship.ResponseDate = DateTime.UtcNow;

        _context.Friendships.Update(friendship);

        await _context.SaveChangesAsync(CancellationToken.None);

        await _eventBus.PublishAsync(new AcceptFriendshipInvitationEvent(friendship.RequesterId));

        return Result.Success();
    }


    public async Task<Result> RemoveFriendAsync(string targetUserId)
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId))
            throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var user = await _identityService.FindUserByUserByIdAsync(targetUserId);
        if (user is null)
            return Result.Failure(new NotFoundError("The User does not exist!"));

        var friendship = await _context
            .Friendships.Involving(currentUserId, user.Id)
            .FirstOrDefaultAsync();
        if (friendship is null)
            return Result.Failure(new NotFoundError("Friendship does not exist!"));


        _context.Friendships.Remove(friendship);

        await _context.SaveChangesAsync(CancellationToken.None);

        return Result.Success();
    }
}
