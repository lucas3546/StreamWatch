using System;

namespace StreamWatch.Application.Common.Models;

public class UserSearchResultModel
{
    public UserSearchResultModel(string id, string userName, string? profilePicThumb)
    {
        Id = id;
        UserName = userName;
        ProfilePicThumb = profilePicThumb;
    }

    public string Id { get; set; }
    public string UserName { get; set; }
    public string? ProfilePicThumb { get; set; }
}
