using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class UserSessionService : IUserSessionService
{
    private readonly IUserSessionRepository _userSessionRepository;
    private readonly ICurrentUserService _user;
    private readonly IEventBus _eventBus;


    public UserSessionService(IUserSessionRepository userSessionRepository, IEventBus eventBus, ICurrentUserService user)
    {
        _userSessionRepository = userSessionRepository;
        _eventBus = eventBus;
        _user = user;
    }
    public async Task<Result<string>> CreateSessionAsync(CreateSessionRequest request)
    {
        var session = new UserSessionCache()
        {
            UserId = request.UserId,
            UserName = request.UserName,
            ProfilePicName = request.PictureFilename,
            RoomId = request.RoomId,
            ConnectionId = request.ConnectionId,
            EnteredAt = DateTime.UtcNow,
        };

        var id = await _userSessionRepository.Create(session);

        return Result<string>.Success(id);
    }

    public async Task<Result> RemoveSessionAsync(string connectionId)
    {
        var session = await _userSessionRepository.GetUserSessionAsync(connectionId);

        if (session == null) return Result.Failure(new ValidationError("Session not found"));

        await _userSessionRepository.Remove(session);
        
        return Result.Success();
    }

    public async Task<Result> AddToRoom(string connectionId, string roomId)
    {
        ArgumentException.ThrowIfNullOrEmpty(_user.Id);
        
        var session = await _userSessionRepository.GetUserSessionAsync(connectionId);

        if (session == null) return Result.Failure(new ValidationError("Session not found"));

        session.RoomId = roomId;
        session.EnteredAt = DateTime.UtcNow;

        await _userSessionRepository.UpdateAsync(session);

        await _eventBus.PublishAsync(new UserJoinedRoomEvent(session, _user.Id));

        return Result.Success();
    }

    public async Task<UserSessionCache?> GetUserSessionAsync(string connectionId)
    {
        var session = await _userSessionRepository.GetUserSessionAsync(connectionId);

        return session;
    }


    public async Task<UserSessionCache?> GetUserSessionByIdAsync(string userId)
    {
        var session = await _userSessionRepository.GetUserSessionByIdAsync(userId);

        return session;
    }

    public async Task<IEnumerable<UserSessionCache>> GetUsersFromRoomAsync(string roomId)
    {
        var sessions = await _userSessionRepository.GetUsersFromRoomAsync(roomId);

        return sessions;
    }

    public async Task<UserSessionCache?> GetOldestUserSessionFromRoomAsync(string roomId)
    {
       return await _userSessionRepository.GetOldestUserSessionFromRoomAsync(roomId);
    }

    public async Task<UserSessionCache?> GetUserSessionInRoomAsync(string roomId, string userId)
    {
        return await _userSessionRepository.FindUserSessionInRoomAsync(roomId, userId);
    }

    public async Task<UserSessionCache?> GetUserSessionByNameInRoomAsync(string roomId, string userName)
    {
        return await _userSessionRepository.GetUserSessionByUserNameInRoomAsync(roomId, userName);
    }

    public async Task<bool> UserHasOtherSessionsInRoomAsync(string userId, string roomId)
    {
        var sessions = await _userSessionRepository.FindUserSessionsInRoomAsync(roomId, userId);

        return sessions.Count() > 1 ? true : false;
    }
}