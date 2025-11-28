using System.ComponentModel.DataAnnotations;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public record CreateRoomRequest
{
    public required string Title { get; init; }
    public RoomCategory Category  { get; init; }
    public RoomVideoProvider Provider { get; init; }
    public string? VideoUrl { get; init; }
    public string? MediaId { get; init; }
    public bool IsPublic  { get; init; }
}