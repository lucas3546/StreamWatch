using System;
using System.ComponentModel.DataAnnotations;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public class AddVideoToPlaylistRequest
{
    [Length(5,40)]
    public required string RoomId { get; set; }
    [Length(5, 300)]
    public string? VideoUrl { get; init; }
    public Guid? MediaId { get; init; }
    public required RoomVideoProvider Provider { get; init; }
}
