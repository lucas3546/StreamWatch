using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Events.Handlers;

public class FriendshipCreatedEventHandler : IEventHandler<FriendshipCreatedEvent>
{
    private readonly IApplicationDbContext _context;

    public FriendshipCreatedEventHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task HandleAsync(FriendshipCreatedEvent @event, CancellationToken cancellationToken = default)
    {
        var notification = new Notification()
        {
            ToAccountId = @event.toaccountid,
            CreatedBy = @event.requesterId,
            IsRead = false,
            Payload = "",
            Type = NotificationType.FriendInvitation
        };
        
        await _context.Notifications.AddAsync(notification, cancellationToken);
        
        await _context.SaveChangesAsync(cancellationToken);
    }
}