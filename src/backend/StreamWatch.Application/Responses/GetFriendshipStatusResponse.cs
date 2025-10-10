using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Responses;

public record GetFriendshipStatusResponse(FriendshipStatus Status, DateTime RequestDate, DateTime? RequestResponse, string requestedByUserId);
