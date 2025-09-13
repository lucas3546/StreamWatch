namespace StreamWatch.Application.Requests;

public record UploadImageRequest(string fileName, Stream Image, bool UploadOnlyThumbnail, DateTime? ExpiresAt);