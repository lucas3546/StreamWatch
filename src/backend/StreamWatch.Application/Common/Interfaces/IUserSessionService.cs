using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;

namespace StreamWatch.Application.Common.Interfaces;

public interface IUserSessionService
{
    Task<Result<string>> CreateSessionAsync(CreateSessionRequest request);
    Task<Result> AddToRoom(string connectionId, string roomId);
    Task<Result> EndSessionAsync(string connectionId);
}