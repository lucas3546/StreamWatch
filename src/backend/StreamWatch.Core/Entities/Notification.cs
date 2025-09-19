using StreamWatch.Core.Common;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Identity;

namespace StreamWatch.Core.Entities;

public class Notification : BaseAuditableEntity
{
    public NotificationType Type { get; set; }
    public string Payload { get; set; }
    public string FromUserName { get; set; }
    public string ToAccountId { get; set; }
    public Account? ToAccount { get; set; }
}