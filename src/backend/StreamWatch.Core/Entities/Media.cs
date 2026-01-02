using StreamWatch.Core.Common;
using StreamWatch.Core.Enums;

namespace StreamWatch.Core.Entities;

public class Media : BaseAuditableEntity<Guid>
{
    public string FileName { get; set; }
    
    public string ThumbnailFileName { get; set; }
    
    public string? BucketName { get; set; }
    public decimal Size { get; set; }
    public string ContentType { get; set; }
    public MediaStatus Status { get; set; }
    public DateTime? ExpiresAt { get; set; }
}