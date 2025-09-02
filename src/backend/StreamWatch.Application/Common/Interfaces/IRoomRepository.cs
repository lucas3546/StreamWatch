using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Common.Interfaces;

public interface IRoomRepository
{
    Task<RoomCache?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<string> SaveAsync(RoomCache room, CancellationToken ct = default);
    Task DeleteAsync(string id, CancellationToken ct = default);
    Task<IEnumerable<RoomCache>> GetAllAsync(CancellationToken ct = default);
}