using System;
using System.ComponentModel.DataAnnotations;

namespace StreamWatch.Application.Requests;

public record ChangeUsernameRequest
{
    [Required]
    public required string newUsername { get; init; }
}
