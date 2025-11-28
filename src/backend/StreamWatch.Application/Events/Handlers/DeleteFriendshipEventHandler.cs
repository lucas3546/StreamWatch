using System;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Events.Handlers;

public class DeleteFriendshipEventHandler : IEventHandler<DeleteFriendshipEvent>
{
    private readonly IRealtimeMessengerService _realtimeMessengerService;
    public DeleteFriendshipEventHandler(IRealtimeMessengerService realtimeMessengerService)
    {
        _realtimeMessengerService = realtimeMessengerService;
    }
    public async Task HandleAsync(DeleteFriendshipEvent @event, CancellationToken cancellationToken = default)
    {
        await _realtimeMessengerService.SendToUsersAsync(@event.receiverId, @event.requesterId, "UpdateFriendState", new UpdateFriendshipStatusModel(@event.requesterId, @event.receiverId, FriendInvitationStatus.Declined.ToString(), @event.requestDate, @event.responseDate));
    }
}
