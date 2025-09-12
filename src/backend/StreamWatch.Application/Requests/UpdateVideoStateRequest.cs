namespace StreamWatch.Application.Requests;

public class UpdateVideoStateRequest
{
    public required string RoomId { get; init; }
    public required decimal CurrentTimestamp { get; init; }
    public required decimal SentAt { get; init; }
    public required bool IsPaused  { get; init; }
}

