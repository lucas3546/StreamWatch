using System;

namespace StreamWatch.Application.Common.Models;

public class BasicUserRoomModel
{
    public BasicUserRoomModel(string userId, string userName, string? profilePic)
    {
        UserId = userId;
        UserName = userName;
        ProfilePic = profilePic;
    }
    public string UserId { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string? ProfilePic { get; set; } = default!;
}
