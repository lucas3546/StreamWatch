using System;

namespace StreamWatch.Application.Requests;

public record BanAccountRequest
{
    public required string TargetUserId { get; init; }
    public string? PrivateReason { get; init; }
    public required string PublicReason { get; init; }
    public DateTime ExpiresAt { get; init; }
}
