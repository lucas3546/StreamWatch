using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;

namespace StreamWatch.Application.Common.Interfaces;

public interface IFriendshipService
{
    Task<Result> SendFriendshipInvitationAsync(SendFriendshipInvitationRequest request);
    Task<Result> AcceptFriendshipInvitationAsync(AcceptFriendshipInvitationRequest request);
    Task<Result> DeclineFriendshipInvitationAsync(DeclineFriendInvitationRequest request);
    Task<Result<IEnumerable<FriendModel>>> GetAllFriendsAsync();
    Task<Result<PaginatedList<FriendModel>>> GetPagedFriendsAsync(GetPagedFriendsRequest request);
    Task<Result> RemoveFriendAsync(RemoveFriendRequest request);
}