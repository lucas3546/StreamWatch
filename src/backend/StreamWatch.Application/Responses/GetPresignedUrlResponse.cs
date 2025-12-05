namespace StreamWatch.Application.Responses;

public record GetPresignedUrlResponse(string Url, string HttpVerb, Dictionary<string, string> Headers, Guid MediaId, DateTime expiresAt);