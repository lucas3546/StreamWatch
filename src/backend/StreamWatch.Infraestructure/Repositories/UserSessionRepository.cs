using Redis.OM;
using Redis.OM.Searching;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Cache;

namespace StreamWatch.Infraestructure.Repositories;

public class UserSessionRepository : IUserSessionRepository
{
    private readonly RedisConnectionProvider _provider;
    private readonly IRedisCollection<UserSessionCache> _sessions;

    public UserSessionRepository(RedisConnectionProvider provider)
    {
        _provider = provider;
        _sessions = (RedisCollection<UserSessionCache>)provider.RedisCollection<UserSessionCache>();
    }

    public async Task<string> Create(UserSessionCache userSession, CancellationToken ct = default)
    {
        var userSessionId = await _sessions.InsertAsync(userSession);

        return userSessionId.Replace("UserSession:", "");
    }

    public async Task UpdateAsync(UserSessionCache userSession, CancellationToken ct = default)
    {
        await _sessions.UpdateAsync(userSession);
    }

    public async Task<IEnumerable<UserSessionCache>> GetUsersFromRoomAsync(string roomId)
    {
        return await _sessions.Where(x => x.RoomId == roomId).ToListAsync();
    }

    public async Task<IEnumerable<UserSessionCache>> FindUserSessionsInRoomAsync(string roomId, string userId)
    {
        return await _sessions.Where(x => x.RoomId == roomId && x.UserId == userId).ToListAsync();
    }

    public async Task<UserSessionCache?> GetMostRecentUserSessionFromRoomAsync(string roomId, CancellationToken ct = default)
    {
        return await _sessions
            .Where(x => x.RoomId == roomId)
            .OrderByDescending(x => x.EnteredAt)
            .FirstOrDefaultAsync();
    }

    public async Task<UserSessionCache?> GetUserSessionAsync(string connectionId, CancellationToken ct = default)
    {
        return await _sessions.FirstOrDefaultAsync(x => x.ConnectionId == connectionId);
    }

    public async Task<UserSessionCache?> GetUserSessionByIdAsync(string userId, CancellationToken ct = default)
    {
        return await _sessions.FirstOrDefaultAsync(x => x.UserId == userId);
    }

    public async Task<UserSessionCache?> GetUserSessionByUserNameAsync(string userName, CancellationToken ct = default)
    {
        return await _sessions.FirstOrDefaultAsync(x => x.UserName == userName);
    }
    
    public async Task Remove(UserSessionCache userSessionCache, CancellationToken ct = default)
    {
        await _sessions.DeleteAsync(userSessionCache);
    }
}