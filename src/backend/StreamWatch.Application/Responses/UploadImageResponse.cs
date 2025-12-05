namespace StreamWatch.Application.Responses;

public record UploadImageResponse(string filePublicUrl, string thumbPublicUrl, string BucketName, decimal Size, Guid MediaId, DateTime? ExpiresAt);