using System.ComponentModel.DataAnnotations;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public record CreateRoomRequest
{
    public string Title { get; init; }
    [Range(1, 10)]
    public RoomCategory Category  { get; init; }
    public RoomVideoProvider Provider { get; init; }
    public string? VideoUrl { get; init; }
    public string? MediaId { get; init; }
    public bool IsPublic  { get; init; }
}