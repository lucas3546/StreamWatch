namespace StreamWatch.Application.Requests;

public record GetBasicUserProfileDataResponse(string userId, string? userName, string? profilePicThumbnailUrl);

