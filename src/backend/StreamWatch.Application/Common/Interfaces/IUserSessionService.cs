using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Common.Interfaces;

public interface IUserSessionService
{
    Task<Result<string>> CreateSessionAsync(CreateSessionRequest request);
    Task<bool> UserHasOtherSessionsInRoomAsync(string userId, string roomId);
    Task<UserSessionCache?> GetUserSessionAsync(string connectionId);
    Task<UserSessionCache?> GetUserSessionByIdAsync(string userId);
    Task<UserSessionCache?> GetUserSessionInRoomAsync(string roomId, string userId);
    Task<UserSessionCache?> GetUserSessionByNameInRoomAsync(string roomId, string userName);
    Task<UserSessionCache?> GetOldestUserSessionFromRoomAsync(string roomId);
    Task<IEnumerable<UserSessionCache>> GetUsersFromRoomAsync(string roomId);
    Task<Result> AddToRoom(string connectionId, string roomId);
    Task<Result> RemoveSessionAsync(string connectionId);
}