namespace StreamWatch.Application.Common.Extensions;

public static class DbContextQueryableExtensions
{
    public static IQueryable<T> GetPaged<T>(this IQueryable<T> query, int page, int pageSize)  where T : class
    {
        return query.Skip((page - 1) * pageSize).Take(pageSize);
    }
}