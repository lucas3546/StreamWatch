using StreamWatch.Core.Common;

namespace StreamWatch.Core.Entities;

public class Media : BaseAuditableEntity
{
    public string FileName { get; set; }
    public string SourceUrl  { get; set; }
    public string ThumbnailUrl { get; set; }
    public DateTime? ExpiresAt { get; set; }
}