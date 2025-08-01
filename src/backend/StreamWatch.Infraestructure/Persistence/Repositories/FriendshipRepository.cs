using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Entities;

namespace StreamWatch.Infraestructure.Persistence.Repositories;

public class FriendshipRepository : GenericRepository<Friendship>, IFriendshipRepository
{
    private readonly DbSet<Friendship> _friendInvitation;
    
    public FriendshipRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
        _friendInvitation = dbContext.Set<Friendship>();
    }

    public async Task<Friendship?> GetFriendshipByIdsAsync(string accountId1, string accountId2)
    {
        return await _friendInvitation.FirstOrDefaultAsync(x => x.AddresseeId == accountId1 && x.RequesterId == accountId2 ||  x.AddresseeId == accountId2 && x.RequesterId == accountId1);
    }
}