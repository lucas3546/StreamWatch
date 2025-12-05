using System;
using System.ComponentModel.DataAnnotations;
using StreamWatch.Application.Common.Attributes;

namespace StreamWatch.Application.Requests;

public record ChangePasswordRequest
{
    [Password]
    [Length(6, 40)]
    public required string CurrentPassword { get; init; }
    [Password]
    [Length(6, 40)]
    public required string NewPassword { get; init; }
}
