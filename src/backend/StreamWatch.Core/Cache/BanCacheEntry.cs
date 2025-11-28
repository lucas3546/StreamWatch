using System;
using Redis.OM.Modeling;

namespace StreamWatch.Core.Cache;

[Document(StorageType = StorageType.Json, Prefixes = new[] { "BanCacheEntry" })]
public class BanCacheEntry
{
    [RedisIdField]
    [Indexed]
    public string Id { get; set; } //Ip Address or UserId
    public bool BanIsActive { get; set; }
}

