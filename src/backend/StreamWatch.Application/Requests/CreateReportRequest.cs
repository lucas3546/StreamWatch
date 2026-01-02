using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;
public record CreateReportRequest
{
    [Length(0, 300)]
    public string? Details {get; init;}
    public required string TargetId {get; init;}
    public required ReportTargetType TargetType {get; init;}
    public required ReportCategory Category {get; init;}
}