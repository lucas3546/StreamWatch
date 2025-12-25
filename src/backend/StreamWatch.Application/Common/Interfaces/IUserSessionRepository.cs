using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Common.Interfaces;

public interface IUserSessionRepository
{
    Task<string> Create(UserSessionCache userSession, CancellationToken ct = default);
    Task<UserSessionCache?> GetUserSessionAsync(string connectionId, CancellationToken ct = default);
    Task<IEnumerable<UserSessionCache>> GetUsersFromRoomAsync(string roomId);
    Task<UserSessionCache?> GetUserSessionByIdAsync(string userId, CancellationToken ct = default);
    Task<UserSessionCache?> GetUserSessionByUserNameInRoomAsync(string roomId, string userName, CancellationToken ct = default);
    Task<UserSessionCache?> GetOldestUserSessionFromRoomAsync(string roomId, CancellationToken ct = default);
    Task<IEnumerable<UserSessionCache>> FindUserSessionsInRoomAsync(string roomId, string userId);
    Task<UserSessionCache?> FindUserSessionInRoomAsync(string roomId, string userId);
    Task UpdateAsync(UserSessionCache userSession, CancellationToken ct = default);
    Task Remove(UserSessionCache userSessionCache, CancellationToken ct = default);
}