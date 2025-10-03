using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Common.Models;

public record UploadedFile(string FileName, string PublicUrl, string? BucketName, string? ContentType, long? Size, Stream? Stream);
