namespace StreamWatch.Application.Common.Models;

public record ExtendedMediaModel(Guid MediaId, string fileUrl, string thumbnailUrl, decimal Size, DateTime? expiresAt);