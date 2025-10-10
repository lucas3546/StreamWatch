namespace StreamWatch.Application.Requests;

public record SendFriendshipInvitationRequest
{
    public required string UserId { get; init; }
}