using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Responses
{
    public record GetReportPagedItemResponse(int id, string? details, string targetId, ReportTargetType targetType, ReportCategory category, ReportState state, DateTimeOffset createdAt);

}