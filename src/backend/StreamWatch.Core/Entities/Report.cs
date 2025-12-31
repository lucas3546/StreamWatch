using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Core.Common;
using StreamWatch.Core.Enums;

namespace StreamWatch.Core.Entities;

public class Report : BaseAuditableEntity<int>
{
    public Report(string? details, string targetId, ReportTargetType targetType, ReportCategory category, ReportState state, string ipAddress)
    {
        Details = details;
        TargetId = targetId;
        TargetType = targetType;
        Category = category;
        State = state;
        IpAddress = ipAddress;
    }
    public string? Details {get; set;}
    public string TargetId {get; set;}
    public ReportTargetType TargetType {get; set;}
    public ReportCategory Category {get; set;}
    public ReportState State {get; set;}
    public string IpAddress {get; set;}
}
