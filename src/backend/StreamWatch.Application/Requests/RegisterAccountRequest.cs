using System.ComponentModel.DataAnnotations;

namespace StreamWatch.Application.Requests;

public record RegisterAccountRequest
{
    public required string Username { get; init; }
    
    [EmailAddress]
    public required string Email { get; init; }
    
    public required string Password { get; init; }
}