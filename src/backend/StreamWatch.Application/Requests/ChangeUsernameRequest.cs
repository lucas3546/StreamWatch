using System;
using System.ComponentModel.DataAnnotations;

namespace StreamWatch.Application.Requests;

public record ChangeUsernameRequest
{
    [Required]
    [Length(6, 25)]
    public required string newUsername { get; init; }
}
