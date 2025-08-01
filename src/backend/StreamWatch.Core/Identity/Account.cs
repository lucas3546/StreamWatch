using Microsoft.AspNetCore.Identity;
using StreamWatch.Core.Entities;

namespace StreamWatch.Core.Identity;

public class Account : IdentityUser
{
    public Media? ProfilePic { get; set; }
    public List<Notification> Notifications { get; set; } = new();

}