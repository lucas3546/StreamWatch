using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Common.Extensions;

public static class FriendshipQueryableExtensions
{
    public static IQueryable<Friendship> Involving(this IQueryable<Friendship> query, string userId1, string userId2)
    {
        return query.Where(f =>
            (f.RequesterId == userId1 && f.ReceiverId == userId2) ||
            (f.RequesterId == userId2 && f.ReceiverId == userId1));
    }

    public static IQueryable<Friendship> FromUser(this IQueryable<Friendship> query, string userId)
    {
        return query.Where(x => x.RequesterId == userId || x.ReceiverId == userId);
    }

    public static IQueryable<Friendship> Between(this IQueryable<Friendship> query, string receiverId, string requesterId)
    {
        return query.Where(x => x.ReceiverId == receiverId && x.RequesterId == requesterId);
    }
    
    public static IQueryable<Friendship> WithStatus(this IQueryable<Friendship> query, FriendshipStatus status)
    {
        return query.Where(f => f.Status == status);
    }
    
}