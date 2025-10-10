using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Application.Common.Interfaces;

public interface IFriendshipService
{
    Task<Result<IEnumerable<FriendModel>>> GetAllFriendsAsync();
    Task<Result<PaginatedList<FriendModel>>> GetPagedFriendsAsync(GetPagedFriendsRequest request);
    Task<Result<GetFriendshipStatusResponse>> GetFriendshipStatusAsync(string userId);
    Task<Result> SendFriendshipInvitationAsync(string targetUserId);
    Task<Result> AcceptFriendshipInvitationAsync(string requesterId);
    Task<Result> RemoveFriendAsync(string targetUserId);
}