using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Events.DomainEvents;

public record UserLeftRoomEvent(UserSessionCache sessionCache) : IEvent
{
    
}