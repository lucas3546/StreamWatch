using Microsoft.EntityFrameworkCore;
using StreamWatch.Core.Entities;

namespace StreamWatch.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    
    DbSet<Friendship> Friendships { get; }
    DbSet<Media> Media { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<Ban> Bans { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}