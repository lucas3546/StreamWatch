using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Events.DomainEvents;

namespace StreamWatch.Application.Events.Handlers;

public class UserJoinedRoomEventHandler : IEventHandler<UserJoinedRoomEvent>
{
    private readonly IRoomRepository _roomRepository;

    public UserJoinedRoomEventHandler(IRoomRepository roomRepository)
    {
        _roomRepository = roomRepository;
    }

    public async Task HandleAsync(UserJoinedRoomEvent @event, CancellationToken cancellationToken = default)
    {
        if (@event.sessionCache.RoomId == null) return;
        
        var room = await _roomRepository.GetByIdAsync(@event.sessionCache.RoomId);

        room.UsersCount++;
        
        await _roomRepository.UpdateAsync(room, cancellationToken);
    }
}

