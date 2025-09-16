namespace StreamWatch.Application.Common.Models;

public record FriendModel(string userName, string? profilePicUrl,string? profileThumbUrl, string status, DateTime? friendshipDate);