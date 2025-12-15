using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Events.DomainEvents;

namespace StreamWatch.Application.Events.Handlers;

public class UserLeftRoomEventHandler : IEventHandler<UserLeftRoomEvent>
{
    private readonly IRoomRepository _roomRepository;
    private readonly IUserSessionRepository _userSessionRepository;
    private readonly IRealtimeMessengerService _realtimeMessengerService;

    public UserLeftRoomEventHandler(IRoomRepository roomRepository, IUserSessionRepository userSessionRepository, IRealtimeMessengerService realtimeMessengerService)
    {
        _roomRepository = roomRepository;
        _userSessionRepository = userSessionRepository;
        _realtimeMessengerService = realtimeMessengerService;
    }

    public async Task HandleAsync(UserLeftRoomEvent @event, CancellationToken cancellationToken = default)
    {
        if (@event.sessionCache.RoomId == null) return;
        
        var room = await _roomRepository.GetByIdAsync(@event.sessionCache.RoomId);
        
        if(room == null) return;

        room.UsersCount = room.UsersCount - 1; //room.UsersCount--; don't work with Redis OM;

        
        if (@event.sessionCache.UserId == room.LeaderAccountId)
        {   
            Console.WriteLine("ENTERINFG");
            var latestRoomUser = await _userSessionRepository.GetOldestUserSessionFromRoomAsync(@event.sessionCache.RoomId);
           
            if (latestRoomUser is null || latestRoomUser.UserId == null) return;
            Console.WriteLine("LEAVING");
            room.LeaderAccountId = latestRoomUser.UserId;
            
            await _realtimeMessengerService.SendToGroupAsync(room.Id.ToString(), "ReceiveMessage", new { Id = Guid.NewGuid().ToString(), IsNotification = true, Text = $"{latestRoomUser.UserName} is the new leader", });

            await _realtimeMessengerService.SendToGroupAsync(room.Id.ToString(), "NewLeader", latestRoomUser.UserId);

        }
        await _realtimeMessengerService.SendToGroupAsync(room.Id.ToString(), "UserLeftRoom", @event.sessionCache.UserId);
        
        await _realtimeMessengerService.SendToGroupAsync(room.Id.ToString(), "ReceiveMessage", new { Id = Guid.NewGuid().ToString(), IsNotification = true, Text = $"{@event.sessionCache.UserName} has left the room", });

        await _roomRepository.UpdateAsync(room, cancellationToken);
    }
}
