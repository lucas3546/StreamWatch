using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Events.Handlers;

public class FriendshipCreatedEventHandler : IEventHandler<FriendshipCreatedEvent>
{
    private readonly IApplicationDbContext _context;
    private readonly IRealtimeMessengerService _realtimeMessengerService;

    public FriendshipCreatedEventHandler(IApplicationDbContext context, IRealtimeMessengerService realtimeMessengerService)
    {
        _context = context;
        _realtimeMessengerService = realtimeMessengerService;
    }

    public async Task HandleAsync(FriendshipCreatedEvent @event, CancellationToken cancellationToken = default)
    {
        var notification = new Notification()
        {
            ToAccountId = @event.toaccountid,
            FromUserName = @event.requesterName,
            Payload = "",
            Type = NotificationType.FriendInvitation
        };

        await _context.Notifications.AddAsync(notification, cancellationToken);

        await _context.SaveChangesAsync(cancellationToken);
        
        var model = new NotificationModel(notification.Id, notification.FromUserName, notification.Type.ToString(), Payload: null,notification.CreatedAt);

        await _realtimeMessengerService.SendToUserAsync(@event.toaccountid, "ReceiveNotification", model);
        
    }
}