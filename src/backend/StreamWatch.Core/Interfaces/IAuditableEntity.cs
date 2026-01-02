using System;

namespace StreamWatch.Core.Interfaces;

public interface IAuditableEntity
{
    string? CreatedBy { get; set; }
    DateTimeOffset CreatedAt { get; set; }
    string? LastModifiedBy { get; set; }
    DateTimeOffset? LastModifiedAt { get; set; }
}