namespace StreamWatch.Application.Common.Models;

public record ExtendedMediaModel(string MediaId, string FileName, string ThumbnailFileName, decimal Size, DateTime? expiresAt);