namespace StreamWatch.Application.Requests;

public class UpdateVideoStateRequest
{
    public required string RoomId { get; init; }
    public required decimal CurrentTimestamp { get; init; }
    public required decimal SentAt { get; init; }
    public required bool IsPaused  { get; init; }

    public void ValidateModel()
    {
        if(!Ulid.TryParse(RoomId, out _)) throw new ArgumentException("Invalid roomId");

        if (CurrentTimestamp < 0 || CurrentTimestamp > Int32.MaxValue) throw new ArgumentException("Invalid currentTimestamp");
            

        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var diff = Math.Abs(now - (long)SentAt);

        if (diff > 20_000) // 20 seconds max drift
            throw new ArgumentException("Invalid sentAt");
    }
}

