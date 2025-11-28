namespace StreamWatch.Application.Requests;

public record InviteToRoomRequest
{
    public required string RoomId {get; init;}
    public required string TargetAccountId {get; init;}
}
