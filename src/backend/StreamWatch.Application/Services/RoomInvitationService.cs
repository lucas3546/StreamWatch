using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StreamWatch.Application.Common.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class RoomInvitationService : IRoomInvitationService
{
    private readonly IApplicationDbContext _context;
    private readonly IRoomRepository _roomRepository;
    private readonly ICurrentUserService _user;
    private readonly IRealtimeMessengerService _realtimeMessengerService;
    private readonly ILogger<RoomInvitationService> _logger;
    public RoomInvitationService(IApplicationDbContext context, IRoomRepository roomRepository, ICurrentUserService user, IRealtimeMessengerService realtimeMessenger, ILogger<RoomInvitationService> logger)
    {
        _context = context;
        _roomRepository = roomRepository;
        _user = user;
        _realtimeMessengerService = realtimeMessenger;
        _logger = logger;
    }


    public async Task<Result> InviteToRoomAsync(InviteToRoomRequest request)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(_user.Id);

        ArgumentNullException.ThrowIfNullOrEmpty(_user.Name);

        var friendship = await _context.Friendships.WithStatus(FriendshipStatus.Accepted).Involving(_user.Id, request.TargetAccountId).FirstOrDefaultAsync();

        if(friendship is null) return Result.Failure(new ValidationError("NotFriends","Users are not friends"));

        var room = await _roomRepository.GetByIdAsync(request.RoomId);

        if(room is null) return Result.Failure(new ValidationError("RoomNotFound","The room doesn't exists"));

        var notification = new Notification()
        {
            ToAccountId = request.TargetAccountId,
            FromUserName = _user.Name,
            Payload = request.RoomId,
            Type = NotificationType.RoomInvitation
        };

        await _context.Notifications.AddAsync(notification, CancellationToken.None);

        await _context.SaveChangesAsync(CancellationToken.None);

        _logger.LogInformation("Notification created, NotificationId={notificationId}", notification.Id);
        
        var model = new NotificationModel(notification.Id, _user.Name, _user.Id, _user.ProfilePicUrl, notification.Type.ToString(), Payload: request.RoomId, notification.CreatedAt);

        await _realtimeMessengerService.SendToUserAsync(notification.ToAccountId, "ReceiveNotification", model);

        return Result.Success();
    }
}
