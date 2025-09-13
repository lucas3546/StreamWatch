using Microsoft.AspNetCore.Http;

namespace StreamWatch.Application.Requests;

public record SendMessageRequest
{
    public required string RoomId { get; init; }
    public required string Message  { get; init; }
    public IFormFile? Image { get; init; }
    public string? ReplyToMessageId { get; init; }
}