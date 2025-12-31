using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Request;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Application.Common.Interfaces
{
    public interface IReportService
    {
        Task<Result<int>> CreateAsync(CreateReportRequest request);
        Task<Result<GetReportResponse>> GetReportByIdAsync(int id);
        Task<PaginatedList<GetReportPagedItemResponse>> GetPagedReportsAsync(GetPagedReportsRequest request);
        Task<Result> UpdateReportStateAsync(UpdateReportStateRequest request);
    }
}