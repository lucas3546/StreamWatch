using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;

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
    
    public async Task<Friendship?> GetPendingInvitationForAddresseeAsync(string addresseeId, string requesterId)
    {
        return await _friendInvitation.FirstOrDefaultAsync(x =>
            x.AddresseeId == addresseeId &&
            x.RequesterId == requesterId &&
            x.Status == FriendshipStatus.Pending);
    }
}