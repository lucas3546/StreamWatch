using System;

namespace StreamWatch.Application.Requests;

public record ChangePasswordRequest
{
    public required string CurrentPassword { get; init; }
    public required string NewPassword { get; init; }
}
