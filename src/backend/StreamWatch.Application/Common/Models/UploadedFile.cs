using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Common.Models;

public record UploadedFile(string FileName, MediaProvider Provider, string? BucketName, string? ContentType, long? Size, Stream? Stream);
