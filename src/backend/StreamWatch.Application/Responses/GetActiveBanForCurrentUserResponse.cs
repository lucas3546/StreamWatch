namespace StreamWatch.Application.Responses;

public record  GetActiveBanForCurrentUserResponse(string Id, string Reason, DateTime ExpiresAt);

