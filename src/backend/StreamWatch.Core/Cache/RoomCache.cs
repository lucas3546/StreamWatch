using Redis.OM.Modeling;
using StreamWatch.Core.Enums;

namespace StreamWatch.Core.Cache;


[Document(StorageType = StorageType.Json, Prefixes = new[] { "Room" })]
public class RoomCache
{
    [RedisIdField]
    [Indexed]
    public Ulid Id { get; set; }
    [Indexed]
    public string Title { get; set; }
    [Indexed]
    public RoomCategory Category { get; set; }
    [Indexed]
    public string VideoUrl { get; set; }
    [Indexed]
    public string ThumbnailUrl { get; set; }
    [Indexed]
    public bool IsPublic { get; set; }
    [Indexed]
    public string VideoProvider { get; set; }
    [Indexed]
    public string LeaderAccountId { get; set; }
    [Indexed]
    public string CreatedByAccountId { get; set; }
    [Indexed]
    public bool IsPaused { get; set; }
    [Indexed]
    public decimal LastLeaderUpdateTime { get; set; }
    [Indexed]
    public decimal CurrentVideoTime { get; set; }
    [Indexed]
    public DateTime CreatedAt { get; set; }
    [Indexed]
    public int UsersCount { get; set; }
    [Indexed(CascadeDepth = 1)]
    public List<PlaylistVideoItem> PlaylistVideoItems { get; set; } = new List<PlaylistVideoItem>();
}