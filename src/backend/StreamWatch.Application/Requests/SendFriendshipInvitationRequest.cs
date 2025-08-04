namespace StreamWatch.Application.Requests;

public record SendFriendshipInvitationRequest
{
    public required string UserName { get; init; }
}