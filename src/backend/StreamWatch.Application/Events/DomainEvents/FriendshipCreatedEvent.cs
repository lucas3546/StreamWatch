using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Events.DomainEvents;

public record FriendshipCreatedEvent(string requesterId, string requesterName, string toaccountid) : IEvent
{
    
}