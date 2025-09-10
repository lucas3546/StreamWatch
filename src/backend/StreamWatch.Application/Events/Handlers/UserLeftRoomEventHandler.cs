using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Events.DomainEvents;

namespace StreamWatch.Application.Events.Handlers;

public class UserLeftRoomEventHandler : IEventHandler<UserLeftRoomEvent>
{
    private readonly IRoomRepository _roomRepository;

    public UserLeftRoomEventHandler(IRoomRepository roomRepository)
    {
        _roomRepository = roomRepository;
    }

    public async Task HandleAsync(UserLeftRoomEvent @event, CancellationToken cancellationToken = default)
    {
        if (@event.sessionCache.RoomId == null) return;
        
        var room = await _roomRepository.GetByIdAsync(@event.sessionCache.RoomId);
        
        if(room == null) return;

        room.UsersCount = room.UsersCount - 1; //room.UsersCount--; don't work with Redis OM for some reason -_-
        
        await _roomRepository.UpdateAsync(room, cancellationToken);
    }
}
