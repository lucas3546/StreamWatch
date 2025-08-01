using StreamWatch.Core.Entities;

namespace StreamWatch.Application.Common.Interfaces;

public interface IFriendshipRepository : IGenericRepository<Friendship>
{
    Task<Friendship?> GetFriendshipByIdsAsync(string accountId1, string accountId2);
}