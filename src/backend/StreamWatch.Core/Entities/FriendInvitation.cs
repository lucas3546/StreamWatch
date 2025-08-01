using StreamWatch.Core.Common;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Identity;

namespace StreamWatch.Core.Entities;

public class FriendInvitation : BaseAuditableEntity
{
    public FriendInvitationStatus Status { get; set; }
    public string ToAccountId { get; set; }  
    public Account? ToAccount { get; set; }
    public Account? CreatedByAccount { get; set; }
}