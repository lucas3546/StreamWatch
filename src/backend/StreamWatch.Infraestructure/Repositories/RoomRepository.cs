using Redis.OM;
using Redis.OM.Contracts;
using Redis.OM.Searching;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Cache;

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
        

    public async Task DeleteAsync(string id, CancellationToken ct = default)
    {
        var room = await GetByIdAsync(id, ct);
        if (room != null) await _rooms.DeleteAsync(room);
    }

    public async Task<IEnumerable<RoomCache>> GetAllAsync(CancellationToken ct = default)
        => await _rooms.ToListAsync();
}
