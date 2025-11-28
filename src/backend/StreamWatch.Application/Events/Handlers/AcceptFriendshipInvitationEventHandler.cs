using System;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Events.Handlers;


public class AcceptFriendshipInvitationEventHandler : IEventHandler<AcceptFriendshipInvitationEvent>
{
    private readonly IApplicationDbContext _context;
    private readonly IRealtimeMessengerService _realtimeMessengerService;
    private readonly ICurrentUserService _user;
    public AcceptFriendshipInvitationEventHandler(IApplicationDbContext context, IRealtimeMessengerService realtimeMessengerService, ICurrentUserService currentUserService)
    {
        _context = context;
        _realtimeMessengerService = realtimeMessengerService;
        _user = currentUserService;
    }

    public async Task HandleAsync(AcceptFriendshipInvitationEvent @event, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(_user.Id);

        ArgumentNullException.ThrowIfNullOrEmpty(_user.Name);

        var notification = new Notification()
        {
            ToAccountId = @event.requesterId,
            FromUserName = _user.Name,
            Payload = "",
            Type = NotificationType.FriendRequestAccepted
        };

        await _context.Notifications.AddAsync(notification, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
        
        var model = new NotificationModel(notification.Id, _user.Name, _user.Id, _user.ProfilePicUrl, notification.Type.ToString(), Payload: null, notification.CreatedAt);

        await _realtimeMessengerService.SendToUserAsync(notification.ToAccountId, "ReceiveNotification", model);

        await _realtimeMessengerService.SendToUsersAsync(_user.Id, @event.requesterId, "UpdateFriendState", new UpdateFriendshipStatusModel(@event.requesterId, _user.Id, FriendInvitationStatus.Accepted.ToString(), @event.requestDate, @event.responseDate));
        
    }
}