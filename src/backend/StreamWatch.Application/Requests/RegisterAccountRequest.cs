using System.ComponentModel.DataAnnotations;
using StreamWatch.Application.Common.Attributes;

namespace StreamWatch.Application.Requests;

public record RegisterAccountRequest
{
    [Length(6, 25)]
    public required string Username { get; init; }
    
    [EmailAddress]
    [Length(2, 60)]
    public required string Email { get; init; }
    [Password]
    [Length(6, 40)]
    public required string Password { get; init; }
}