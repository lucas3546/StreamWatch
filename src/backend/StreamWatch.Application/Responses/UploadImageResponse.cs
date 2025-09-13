namespace StreamWatch.Application.Responses;

public record UploadImageResponse(string FileName, string ThumbnailFileName, string BucketName, decimal Size, DateTime? ExpiresAt);