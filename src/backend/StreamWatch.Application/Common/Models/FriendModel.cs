namespace StreamWatch.Application.Common.Models;

public record FriendModel(string userName, string? thumbnailProfilePicUrl, string? profilePicUrl, DateTime? friendshipDate);