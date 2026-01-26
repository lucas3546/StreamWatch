using Microsoft.EntityFrameworkCore;
using Redis.OM;
using Redis.OM.Contracts;
using Redis.OM.Searching;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Constants;
using StreamWatch.Core.Enums;

namespace StreamWatch.Infraestructure.Repositories;


public class RoomRepository : IRoomRepository
{
    private readonly RedisConnectionProvider _provider;
    private readonly IRedisCollection<RoomCache> _rooms;
    private readonly ICurrentUserService _user;

    public RoomRepository(RedisConnectionProvider provider, ICurrentUserService currentUser)
    {
        _provider = provider;
        _rooms = (RedisCollection<RoomCache>)provider.RedisCollection<RoomCache>();
        _user = currentUser;
    }

    public async Task<RoomCache?> GetByIdAsync(string id, CancellationToken ct = default)
        => await _rooms.FindByIdAsync(id);

    public async Task<string> SaveAsync(RoomCache room, CancellationToken ct = default)
    {
        var roomId = await _rooms.InsertAsync(room);
        
        return roomId.Replace("RoomCache:", "");
    }
    
    public async Task UpdateAsync(RoomCache room, CancellationToken ct = default)
    {
        await _rooms.UpdateAsync(room);
    }

    public async Task DeleteAsync(RoomCache room, CancellationToken ct = default)
    {
        await _rooms.DeleteAsync(room);
    }

    public async Task DeleteAsync(IEnumerable<RoomCache> rooms, CancellationToken ct = default)
    {
        await _rooms.DeleteAsync(rooms);
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

        if(_user.Role == Roles.User) //Normal users only can view public rooms
        {
            query = query.Where(r => r.IsPublic);
        }

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

    public async Task<IEnumerable<RoomCache>> GetEmptyRooms()
    {
        return await _rooms.Where(x =>x.UsersCount == 0).ToListAsync();
    }
    
        
}
