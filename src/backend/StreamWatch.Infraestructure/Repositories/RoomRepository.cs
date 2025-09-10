using Microsoft.EntityFrameworkCore;
using Redis.OM;
using Redis.OM.Contracts;
using Redis.OM.Searching;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Enums;

namespace StreamWatch.Infraestructure.Repositories;


public class RoomRepository : IRoomRepository
{
    private readonly RedisConnectionProvider _provider;
    private readonly IRedisCollection<RoomCache> _rooms;

    public RoomRepository(RedisConnectionProvider provider)
    {
        _provider = provider;
        _rooms = (RedisCollection<RoomCache>)provider.RedisCollection<RoomCache>();
    }

    public async Task<RoomCache?> GetByIdAsync(string id, CancellationToken ct = default)
        => await _rooms.FindByIdAsync(id);

    public async Task<string> SaveAsync(RoomCache room, CancellationToken ct = default)
    {
        var roomId = await _rooms.InsertAsync(room);

        return roomId.Replace("Room:", "");
    }
    
    public async Task UpdateAsync(RoomCache room, CancellationToken ct = default)
    {
        await _rooms.UpdateAsync(room);
    }

    public async Task DeleteAsync(string id, CancellationToken ct = default)
    {
        var room = await GetByIdAsync(id, ct);
        if (room != null) await _rooms.DeleteAsync(room);
    }

    public async Task<IEnumerable<RoomCache>> GetAllAsync(CancellationToken ct = default) => await _rooms.ToListAsync();
    
    public async Task<int> CountAsync(CancellationToken ct = default) => await _rooms.CountAsync();

    public async Task<IEnumerable<RoomCache>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        RoomCategory category,
        bool includeNswf,
        RoomOrderBy orderBy,
        CancellationToken ct = default)
    {
        var query = _rooms.AsQueryable();

        if (category != RoomCategory.All)
        {
            query = query.Where(r => r.Category == category);
        }

        if (!includeNswf)
        {
            query = query.Where(r => r.Category != RoomCategory.Nsfw);
        }

        query = orderBy switch
        {
            RoomOrderBy.Recent     => query.OrderByDescending(r => r.CreatedAt),
            RoomOrderBy.MostUsers  => query.OrderByDescending(r => r.UsersCount),
            RoomOrderBy.DateAsc    => query.OrderBy(r => r.CreatedAt),
            RoomOrderBy.DateDesc   => query.OrderByDescending(r => r.CreatedAt),
            _                      => query.OrderByDescending(r => r.CreatedAt)
        };

        query = query.Skip((pageNumber - 1) * pageSize)
            .Take(pageSize);

        return await query.ToListAsync(ct);
    }

    
    
        
}
