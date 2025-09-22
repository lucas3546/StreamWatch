namespace StreamWatch.Application.Common.Models;

public record FriendModel(string userId, string userName, string? profileThumbnail, string requestedByAccountId, string status, DateTime? responseDate, DateTime? requestDate);