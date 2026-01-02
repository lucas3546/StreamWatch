using StreamWatch.Core.Common;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Identity;

namespace StreamWatch.Core.Entities;

public class Friendship : BaseEntity<int>
{
    public string RequesterId { get; set; }
    public Account? Requester { get; set; }
    
    public string ReceiverId { get; set; }
    public Account? Receiver { get; set; }
    
    public FriendshipStatus Status { get; set; } 
    public DateTime RequestDate { get; set; }
    public DateTime? ResponseDate { get; set; }
}