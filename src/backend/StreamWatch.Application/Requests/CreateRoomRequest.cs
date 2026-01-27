using System.ComponentModel.DataAnnotations;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public record CreateRoomRequest
{
    [Length(4, 40)]
    public required string Title { get; init; }
    public RoomCategory Category  { get; init; }
    public RoomVideoProvider Provider { get; init; }
    [Length(1, 300)]
    public string? VideoUrl { get; init; }
    public Guid? MediaId { get; init; }
    public bool IsPublic  { get; init; }
}