using System;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public class AddVideoToPlaylistRequest
{
    public required string RoomId { get; set; }
    public string? VideoUrl { get; init; }
    public string? MediaId { get; init; }
    public required RoomVideoProvider Provider { get; init; }
}
