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

    public async Task<UserSessionCache?> GetUserSessionAsync(string connectionId, CancellationToken ct = default)
    {
        return await _sessions.FirstOrDefaultAsync(x => x.ConnectionId == connectionId);
    }

    public async Task Remove(UserSessionCache userSessionCache, CancellationToken ct = default)
    {
        await _sessions.DeleteAsync(userSessionCache);
    }
}