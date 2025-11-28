using System;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Core.Entities;

namespace StreamWatch.Application.Events.DomainEvents;

public record AcceptFriendshipInvitationEvent(string requesterId, DateTime requestDate, DateTime? responseDate) : IEvent
{

}
