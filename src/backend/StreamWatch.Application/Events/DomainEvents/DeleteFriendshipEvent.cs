using System;
using StreamWatch.Application.Common.Interfaces.Events;

namespace StreamWatch.Application.Events.DomainEvents;

public record DeleteFriendshipEvent(string requesterId, string receiverId, DateTime requestDate, DateTime? responseDate) : IEvent
{

}
