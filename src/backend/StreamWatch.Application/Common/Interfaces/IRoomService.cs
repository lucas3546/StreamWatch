using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Application.Common.Interfaces;

public interface IRoomService
{
    Task<Result<CreateRoomResponse>> CreateRoomAsync(CreateRoomRequest request);
}