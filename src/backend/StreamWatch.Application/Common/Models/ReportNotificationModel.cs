using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Common.Models
{
    public record ReportNotificationModel(int id, string? details, string targetId, string targetType, string category, string state, DateTimeOffset createdAt);
}