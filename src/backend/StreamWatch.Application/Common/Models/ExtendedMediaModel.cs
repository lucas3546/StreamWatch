namespace StreamWatch.Application.Common.Models;

public record ExtendedMediaModel(string MediaId, string fileUrl, string thumbnailUrl, decimal Size, DateTime? expiresAt);