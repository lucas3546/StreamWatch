using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Entities;

namespace StreamWatch.Infraestructure.Persistence.Repositories;

public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
{
    private readonly DbSet<Notification> _friendInvitation;
    
    public NotificationRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
        _friendInvitation = dbContext.Set<Notification>();
    }

    public async Task<IEnumerable<Notification>> GetPagedNotificationsFromUserIdAsync(string userId, int pageNumber, int pageSize)
    {
        return await _friendInvitation.Where(x => x.ToAccountId == userId).OrderBy(x => x.CreatedAt).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
    }
}