using Redis.OM.Modeling;

namespace StreamWatch.Core.Cache;


[Document(StorageType = StorageType.Json, Prefixes = new[] { "UserSession" })]
public class UserSessionCache
{
    [RedisIdField]
    [Indexed]
    public Ulid Id { get; set; }
    
    [Indexed]
    public required string UserId  { get; set; }
    [Indexed]
    public string UserName  { get; set; }
    [Indexed]
    public required string ConnectionId  { get; set; }
    [Indexed]
    public required string RoomId  { get; set; }
    [Indexed]
    public string? ProfilePicName { get; set; }
    [Indexed(Sortable = true)]
    public DateTime? EnteredAt { get; set; }
}