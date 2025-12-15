using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;

namespace StreamWatch.Application.Events.Handlers;

public class UserJoinedRoomEventHandler : IEventHandler<UserJoinedRoomEvent>
{
    private readonly IRoomRepository _roomRepository;
    private readonly IRealtimeMessengerService _realtimeMessengerService;

    public UserJoinedRoomEventHandler(IRoomRepository roomRepository, IRealtimeMessengerService realtimeMessengerService)
    {
        _roomRepository = roomRepository;
        _realtimeMessengerService = realtimeMessengerService;
    }

    public async Task HandleAsync(UserJoinedRoomEvent @event, CancellationToken cancellationToken = default)
    {
        if (@event.sessionCache.RoomId == null) return;
        
        var room = await _roomRepository.GetByIdAsync(@event.sessionCache.RoomId);

        if(room is null) return;

        room.UsersCount++;

        await _roomRepository.UpdateAsync(room, cancellationToken);
    }
}

