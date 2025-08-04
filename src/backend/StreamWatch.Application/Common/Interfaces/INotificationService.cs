using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Entities;

namespace StreamWatch.Application.Common.Interfaces;

public interface INotificationService
{
    Task<Result<PaginatedList<GetPaginatedNotificationItem>>> GetPagedNotificationsAsync(
        GetPagedNotificationsRequest request);

}