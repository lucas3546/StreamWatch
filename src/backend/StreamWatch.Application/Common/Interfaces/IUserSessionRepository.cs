using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Common.Interfaces;

public interface IUserSessionRepository
{
    Task<string> Create(UserSessionCache userSession, CancellationToken ct = default);
    Task<UserSessionCache?> GetUserSessionAsync(string connectionId, CancellationToken ct = default);
    Task UpdateAsync(UserSessionCache userSession, CancellationToken ct = default);
    Task Remove(UserSessionCache userSessionCache, CancellationToken ct = default);
}