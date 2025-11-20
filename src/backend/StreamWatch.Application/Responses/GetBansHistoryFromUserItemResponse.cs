namespace StreamWatch.Application.Responses;

public record class GetBansHistoryFromUserItemResponse(string BanId, string AccountId, string? PrivateReason,string PublicReason, DateTime ExpiresAt, bool isExpired, string createdAt);