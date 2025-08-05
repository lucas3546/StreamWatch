using StreamWatch.Core.Entities;

namespace StreamWatch.Application.Common.Extensions;

public static class NotificationQueryableExtensions
{
    public static IQueryable<Notification> FromAccount(this IQueryable<Notification> query, string accountId)
    {
        return query.Where(x => x.ToAccountId == accountId);
    }
}