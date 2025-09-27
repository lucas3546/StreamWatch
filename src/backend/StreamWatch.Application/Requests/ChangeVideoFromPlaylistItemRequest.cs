using System;

namespace StreamWatch.Application.Requests;

public record ChangeVideoFromPlaylistItemRequest
{
    public required string RoomId { get; set; }
    public required string PlaylistItemId { get; set; }
}
