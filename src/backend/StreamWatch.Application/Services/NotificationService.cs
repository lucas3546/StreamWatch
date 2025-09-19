using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Errors;

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
    public async Task<Result<PaginatedList<NotificationModel>>> GetPagedNotificationsAsync(GetPagedNotificationsRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var notifications = await _context.Notifications.FromAccount(currentUserId).GetPaged(request.PageNumber, request.PageSize).ToListAsync();
        
        var totalItems = await _context.Notifications.CountAsync();
        
        var dtos = notifications.Select(x => new NotificationModel(x.Id, x.FromUserName, x.Type.ToString(), x.Payload, x.CreatedAt));
        
        var response = new PaginatedList<NotificationModel>(dtos, request.PageNumber, request.PageSize, totalItems);
        
        return Result<PaginatedList<NotificationModel>>.Success(response);
    }

    public async Task<Result> DeleteNotification(int notificationId)
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var notification = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == notificationId);

        if (notification is null) return Result.Failure(new NotFoundError("Notification not found!"));

        if (notification.ToAccountId != currentUserId) return Result.Failure(new NotFoundError("Notification not found!"));

        _context.Notifications.Remove(notification);

        await _context.SaveChangesAsync(CancellationToken.None);

        return Result.Success();
    }

    public async Task<Result> ClearNotificationsAsync()
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var notifications = await _context.Notifications.FromAccount(currentUserId).ToListAsync();

        _context.Notifications.RemoveRange(notifications);

        await _context.SaveChangesAsync(CancellationToken.None);

        return Result.Success();
    }
}