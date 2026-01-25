using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Common.Interfaces;

public interface IRoomService
{
    Task<Result<CreateRoomResponse>> CreateRoomAsync(CreateRoomRequest request);
    Task<Result> UpdateRoomAsync(UpdateRoomRequest request);
    Task<Result> UpdateVideoStateAsync(UpdateVideoStateRequest request);
    Task<Result<PlaylistVideoItem>> AddVideoToPlaylist(AddVideoToPlaylistRequest request);
    Task<PaginatedList<GetPagedRoomItemResponse>> GetPagedRooms(GetPagedRoomsRequest request);
    Task<Result> ChangeVideoFromPlaylistItemAsync(ChangeVideoFromPlaylistItemRequest request);
    Task<RoomCache> ChangeRoomLeader(string userId, RoomCache room);
    Task<RoomCache> IncrementUserCount(RoomCache room);
    Task<RoomCache> DecreaseUserCount(RoomCache room);
    Task<RoomCache?> GetRoomByIdAsync(string roomId);
    Task<Result> RemoveRoom(string roomId);
    Task SendMessageToChatAsync(SendMessageRequest request, string? imageUrl);
    Task SendWhisperToChatAsync(SendMessageRequest request, string? imageUrl, string targetConnectionId);
}