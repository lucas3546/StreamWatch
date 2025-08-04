namespace StreamWatch.Application.Requests;

public record AcceptFriendshipInvitationRequest
{
    public required string UserName { get; init; }
}