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
    private readonly ICurrentUserService _currentUserService;
    public AcceptFriendshipInvitationEventHandler(IApplicationDbContext context, IRealtimeMessengerService realtimeMessengerService, ICurrentUserService currentUserService)
    {
        _context = context;
        _realtimeMessengerService = realtimeMessengerService;
        _currentUserService = currentUserService;
    }

    public async Task HandleAsync(AcceptFriendshipInvitationEvent @event, CancellationToken cancellationToken = default)
    {
        var userName = _currentUserService.Name;
        ArgumentNullException.ThrowIfNullOrEmpty(userName);

        var notification = new Notification()
        {
            ToAccountId = @event.requesterId,
            FromUserName = userName,
            Payload = "",
            Type = NotificationType.FriendRequestAccepted
        };

        await _context.Notifications.AddAsync(notification, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
        
        var model = new NotificationModel(notification.Id, notification.FromUserName, notification.Type.ToString(), Payload: null, notification.CreatedAt);

        await _realtimeMessengerService.SendToUserAsync(notification.ToAccountId, "ReceiveNotification", model);
        
    }
}