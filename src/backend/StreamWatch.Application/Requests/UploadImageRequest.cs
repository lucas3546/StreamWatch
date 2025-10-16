namespace StreamWatch.Application.Requests;

public record UploadImageRequest(string fileName, string contentType, Stream Image, bool UploadOnlyThumbnail, DateTime? ExpiresAt);