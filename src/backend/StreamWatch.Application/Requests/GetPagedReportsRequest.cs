using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Request;

public class GetPagedReportsRequest
{
    [Range(1, int.MaxValue)]
    public required int PageNumber {get; set;}
    [Range(1, 20)]
    public required int PageSize {get; set;}
    public required ReportState State {get; set;}
}