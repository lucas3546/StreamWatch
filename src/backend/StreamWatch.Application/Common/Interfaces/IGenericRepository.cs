using System.Linq.Expressions;

namespace StreamWatch.Application.Common.Interfaces;

public interface IGenericRepository<T> where T : class
{
    Task<T> GetByIdAsync(int id);
    Task<IReadOnlyList<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task<int> CountAsync();

    Task<IEnumerable<T>> GetPagedAsync(int page, int pageSize, Expression<Func<T, object>> orderBy, bool ascending = false);
}