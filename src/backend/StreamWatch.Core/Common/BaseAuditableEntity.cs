using StreamWatch.Core.Interfaces;

namespace StreamWatch.Core.Common;

public class BaseAuditableEntity<T> : BaseEntity<T>, IAuditableEntity
{
    public DateTimeOffset CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTimeOffset? LastModifiedAt { get; set; }

    public string? LastModifiedBy { get; set; }
}