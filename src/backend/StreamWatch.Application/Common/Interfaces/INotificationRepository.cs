using StreamWatch.Core.Entities;

namespace StreamWatch.Application.Common.Interfaces;

public interface INotificationRepository : IGenericRepository<Notification>
{
    Task<IEnumerable<Notification>> GetPagedNotificationsFromUserIdAsync(string userId, int pageNumber, int pageSize);
}