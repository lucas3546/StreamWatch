using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Entities;

namespace StreamWatch.Application.Services;

public class NotificationService : INotificationService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public NotificationService(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }
    public async Task<Result<PaginatedList<GetPaginatedNotificationItem>>> GetPagedNotificationsAsync(GetPagedNotificationsRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var notifications = await _context.Notifications.FromAccount(currentUserId).GetPaged(request.PageNumber, request.PageSize).ToListAsync();
        
        var totalItems = await _context.Notifications.CountAsync();
        
        var dtos = notifications.Select(x => new GetPaginatedNotificationItem(x.Id, x.IsRead, x.Type.ToString(), x.CreatedAt));
        
        var response = new PaginatedList<GetPaginatedNotificationItem>(dtos, request.PageNumber, request.PageSize, totalItems);
        
        return Result<PaginatedList<GetPaginatedNotificationItem>>.Success(response);
    }

    public async Task<Result> ClearNotificationsAsync()
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var notifications = await _context.Notifications.FromAccount(currentUserId).ToListAsync();

        _context.Notifications.RemoveRange(notifications);
        
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return Result.Success();
    }
}