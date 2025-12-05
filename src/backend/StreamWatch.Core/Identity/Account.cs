using Microsoft.AspNetCore.Identity;
using StreamWatch.Core.Entities;

namespace StreamWatch.Core.Identity;

public class Account : IdentityUser
{
    public List<Notification> Notifications { get; set; } = new();
    public List<Ban> Bans { get; set; } = new();
    public Guid? ProfilePicId { get; set; }
    public required string IpAddress { get; set; }
    public Media? ProfilePic { get; set; }
    public string? RefreshToken { get; set; }

}