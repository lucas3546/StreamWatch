using System;

namespace StreamWatch.Application.Requests;

public record ChangeVideoFromPlaylistItemRequest
{
    public required string RoomId { get; set; }
    public required string PlaylistItemId { get; set; }


    public void ValidateModel()
    {
        if (!Ulid.TryParse(RoomId, out _)) throw new ArgumentException("RoomId is not a valid room id");
        
        if(!Guid.TryParse(PlaylistItemId, out _)) throw new ArgumentException("PlaylistItemId is not a valid id");
    }
}
