using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public record UpdateReportStateRequest(int Id, ReportState State);
