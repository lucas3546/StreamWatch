namespace StreamWatch.Application.Common.Models;

public record  UpdateFriendshipStatusModel(string requesterId, string receiverId, string friendshipStatus, DateTime requestedDate, DateTime? responseDate);
