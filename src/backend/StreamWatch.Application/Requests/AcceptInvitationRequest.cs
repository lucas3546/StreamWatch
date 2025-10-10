namespace StreamWatch.Application.Requests;

public record AcceptFriendshipInvitationRequest
{
    public required string UserId { get; init; }
}