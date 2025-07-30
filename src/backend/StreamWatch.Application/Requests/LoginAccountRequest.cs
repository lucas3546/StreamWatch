using System.ComponentModel.DataAnnotations;
using StreamWatch.Application.Common.Attributes;

namespace StreamWatch.Application.Requests;

public record LoginAccountRequest
{
    [EmailAddress]
    public required string Email { get; init; }
    [Password]
    public required string Password { get; init; }
}
