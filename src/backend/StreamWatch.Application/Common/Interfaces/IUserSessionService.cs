using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Common.Interfaces;

public interface IUserSessionService
{
    Task<Result<string>> CreateSessionAsync(CreateSessionRequest request);
    Task<IEnumerable<UserSessionCache>> GetUserSessionsAsync(string roomId);
    Task<bool> UserHasOtherSessionsInRoomAsync(string userId, string roomId);
    Task<UserSessionCache?> GetUserSessionAsync(string connectionId);
    Task<Result> AddToRoom(string connectionId, string roomId);
    Task<Result> EndSessionAsync(string connectionId);
}