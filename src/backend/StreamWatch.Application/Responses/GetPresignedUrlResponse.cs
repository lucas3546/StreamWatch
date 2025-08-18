namespace StreamWatch.Application.Responses;

public record GetPresignedUrlResponse(string StorageProvider, string Url, string HttpVerb, Dictionary<string, string> Headers, int MediaId, DateTime expiresAt);