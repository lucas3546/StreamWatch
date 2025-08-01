using StreamWatch.Core.Common;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Identity;

namespace StreamWatch.Core.Entities;

public class Friendship : BaseEntity
{
    public string RequesterId { get; set; }
    public Account? Requester { get; set; }
    
    public string AddresseeId { get; set; }
    public Account? Addressee { get; set; }
    
    public FriendshipStatus Status { get; set; } 
    public DateTime RequestDate { get; set; }
    public DateTime? ResponseDate { get; set; }
}