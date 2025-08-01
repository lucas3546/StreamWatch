using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Persistence.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly ApplicationDbContext _dbContext;

    public GenericRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public virtual async Task<T> GetByIdAsync(int id)
    {
        return await _dbContext.Set<T>().FindAsync(id);
    }


    public async Task<T> AddAsync(T entity)
    {
        await _dbContext.Set<T>().AddAsync(entity);
        await _dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        _dbContext.Entry(entity).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        _dbContext.Set<T>().Remove(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<T>> GetAllAsync()
    {
        return await _dbContext
            .Set<T>()
            .ToListAsync();
    }

    public async Task<int> CountAsync()
    {
        return await _dbContext.Set<T>().CountAsync();
    }

    public async Task<IEnumerable<T>> GetPagedAsync(int page, int pageSize, Expression<Func<T, object>> orderBy, bool ascending = false)
    {
        var query = _dbContext.Set<T>().AsQueryable();

        query = ascending
            ? query.OrderBy(orderBy)
            : query.OrderByDescending(orderBy);
        
        return await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    }
}