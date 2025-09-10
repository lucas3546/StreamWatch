using StreamWatch.Core.Cache;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Common.Interfaces;

public interface IRoomRepository
{
    Task<RoomCache?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<string> SaveAsync(RoomCache room, CancellationToken ct = default);
    Task UpdateAsync(RoomCache room, CancellationToken ct = default);
    Task DeleteAsync(string id, CancellationToken ct = default);
    Task<IEnumerable<RoomCache>> GetAllAsync(CancellationToken ct = default);

    Task<IEnumerable<RoomCache>> GetPagedAsync(int pageNumber, int pageSize, RoomCategory category, bool includeNswf, RoomOrderBy orderBy, CancellationToken ct = default);
        
    Task<int> CountAsync(CancellationToken ct = default);
}