namespace StreamWatch.Application.Responses;

public record UploadImageResponse(string filePublicUrl, string thumbPublicUrl, string BucketName, decimal Size, string MediaId, DateTime? ExpiresAt);