using System.ComponentModel.DataAnnotations;

namespace StreamWatch.Application.Requests;

public record InviteToRoomRequest
{
    [Length(5,40)]
    public required string RoomId {get; init;}
    [Length(10,50)]
    public required string TargetAccountId {get; init;}
}
