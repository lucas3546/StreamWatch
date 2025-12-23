using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace StreamWatch.Application.Requests;

public record SendMessageRequest
{
    [Length(5,60)]
    public required string RoomId { get; init; }
    [Length(1, 250)]
    public required string Message  { get; init; }
    public IFormFile? Image { get; init; }
    public string? ReplyToMessageId { get; init; }
}