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
    private readonly IEventBus _eventBus;


    public UserSessionService(IUserSessionRepository userSessionRepository, IEventBus eventBus)
    {
        _userSessionRepository = userSessionRepository;
        _eventBus = eventBus;
    }
    public async Task<Result<string>> CreateSessionAsync(CreateSessionRequest request)
    {
        var session = new UserSessionCache()
        {
            UserId = request.UserId,
            UserName = request.UserName,
            ProfilePicName = request.PictureFilename,
            ConnectionId = request.ConnectionId,
        };

        var id = await _userSessionRepository.Create(session);

        return Result<string>.Success(id);
    }

    public async Task<Result> EndSessionAsync(string connectionId)
    {
        var session = await _userSessionRepository.GetUserSessionAsync(connectionId);

        if (session == null) return Result.Failure(new ValidationError("Session not found"));

        await _userSessionRepository.Remove(session);

        await _eventBus.PublishAsync(new UserLeftRoomEvent(session));

        return Result.Success();
    }

    public async Task<Result> AddToRoom(string connectionId, string roomId)
    {
        var session = await _userSessionRepository.GetUserSessionAsync(connectionId);

        if (session == null) return Result.Failure(new ValidationError("Session not found"));

        session.RoomId = roomId;
        session.EnteredAt = DateTime.UtcNow;

        await _userSessionRepository.UpdateAsync(session);

        await _eventBus.PublishAsync(new UserJoinedRoomEvent(session));

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

    public async Task<UserSessionCache?> GetUserSessionByUserNameAsync(string userName)
    {
        return await _userSessionRepository.GetUserSessionByUserNameAsync(userName);
    }

    public async Task<IEnumerable<UserSessionCache>> GetUserSessionsAsync(string roomId)
    {
        var sessions = await _userSessionRepository.GetUsersFromRoomAsync(roomId);

        return sessions;
    }

    public async Task<bool> UserHasOtherSessionsInRoomAsync(string userId, string roomId)
    {
        var sessions = await _userSessionRepository.FindUserSessionsInRoomAsync(roomId, userId);

        return sessions.Count() > 1 ? true : false;
    }
}