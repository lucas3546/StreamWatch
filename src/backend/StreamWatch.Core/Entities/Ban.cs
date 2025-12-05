using System;
using StreamWatch.Core.Common;
using StreamWatch.Core.Identity;

namespace StreamWatch.Core.Entities;

public class Ban : BaseAuditableEntity<int>
{
    public required string AccountId { get; set; }
    public Account? Account { get; set; }
    public string? PrivateReason { get; set; }
    public required string PublicReason { get; set; }
    public required string IpAddress { get; set; }
    public DateTime ExpirationTime { get; set; }
    public bool IsExpired { get; set; }
}
