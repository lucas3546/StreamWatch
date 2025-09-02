using Redis.OM.Modeling;

namespace StreamWatch.Core.Cache;


[Document(StorageType = StorageType.Json, Prefixes = new[] { "Room" })]
public class UserSessionCache
{
    [RedisIdField]
    [Indexed]
    public Ulid Id { get; set; }
    [Indexed]
    public required string UserName  { get; set; }
    [Indexed]
    public required string ConnectionId  { get; set; }
    [Indexed]
    public string? RoomId  { get; set; }
    [Indexed]
    public string? ProfilePicUrl { get; set; }
    [Indexed]
    public DateTime EnteredAt { get; set; }
}