using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Entities;

namespace StreamWatch.Application.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _notificationRepository;
    private readonly ICurrentUserService _currentUserService;

    public NotificationService(INotificationRepository notificationRepository, ICurrentUserService currentUserService)
    {
        _notificationRepository = notificationRepository;
        _currentUserService = currentUserService;
    }
    public async Task<Result<PaginatedList<GetPaginatedNotificationItem>>> GetPagedNotificationsAsync(GetPagedNotificationsRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");

        var notifications = await _notificationRepository.GetPagedNotificationsFromUserIdAsync(currentUserId, request.PageNumber, request.PageSize);
        
        var totalItems = await _notificationRepository.CountAsync();
        
        var dtos = notifications.Select(x => new GetPaginatedNotificationItem(x.Id, x.IsRead, x.Type.ToString(), x.CreatedAt));
        
        var response = new PaginatedList<GetPaginatedNotificationItem>(dtos, request.PageNumber, request.PageSize, totalItems);
        
        return Result<PaginatedList<GetPaginatedNotificationItem>>.Success(response);
    }
}