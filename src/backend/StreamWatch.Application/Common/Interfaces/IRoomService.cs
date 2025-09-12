using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Common.Interfaces;

public interface IRoomService
{
    Task<Result<CreateRoomResponse>> CreateRoomAsync(CreateRoomRequest request);
    Task<Result> UpdateVideoStateAsync(UpdateVideoStateRequest request);
    Task<PaginatedList<GetPagedRoomItemResponse>> GetPagedRooms(GetPagedRoomsRequest request);
    Task<RoomCache?> GetRoomByIdAsync(string roomId);
}