using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Application.Request;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Constants;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class ReportService : IReportService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _user;
    private readonly IEventBus _eventBus;
    public ReportService(IApplicationDbContext context, ICurrentUserService user, IEventBus eventBus)
    {
        _context = context;
        _user = user;
        _eventBus = eventBus;
    }
    public async Task<Result<int>> CreateAsync(CreateReportRequest request)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(_user.IpAddress);

        var report = new Report(request.Details, request.TargetId, request.TargetType, request.Category, ReportState.NotReviewed, _user.IpAddress);

        await _context.Reports.AddAsync(report);

        await _context.SaveChangesAsync(CancellationToken.None);

        await _eventBus.PublishAsync(new CreateReportEvent(report));

        return Result<int>.Success(report.Id);
    }

    public async Task<Result<GetReportResponse>> GetReportByIdAsync(int id)
    {
        var report = await _context.Reports.FindAsync(id);

        if(report is null) return Result<GetReportResponse>.Failure(new NotFoundError("Not found"));

        var response = new GetReportResponse(report.Id, report.Details, report.TargetId, report.TargetType, report.Category, report.State, report.IpAddress, report.CreatedBy, report.CreatedAt, report.LastModifiedAt, report.LastModifiedBy);
        
        return Result<GetReportResponse>.Success(response);
    }

    public async Task<PaginatedList<GetReportPagedItemResponse>> GetPagedReportsAsync(GetPagedReportsRequest request)
    {
        var countItems = await _context.Reports.Where(x => x.State == request.State).CountAsync();

        var reports = await _context.Reports
        .Where(x => x.State == request.State)
        .OrderByDescending(x => x.CreatedAt)
        .Select(x => new GetReportPagedItemResponse(
            x.Id, 
            x.Details, 
            x.TargetId, 
            x.TargetType, 
            x.Category, 
            x.State, 
            x.CreatedAt))
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize).ToListAsync();

        var response = new PaginatedList<GetReportPagedItemResponse>(reports, request.PageNumber, request.PageSize, countItems);
        
        return response;
    }

    public async Task<Result> UpdateReportStateAsync(UpdateReportStateRequest request)
    {
        var report = await _context.Reports.FindAsync(request.Id);

        if(report is null) return Result.Failure(new NotFoundError("Not found"));

        report.State = request.State;

        await _context.SaveChangesAsync(CancellationToken.None);

        return Result.Success();
    }
}