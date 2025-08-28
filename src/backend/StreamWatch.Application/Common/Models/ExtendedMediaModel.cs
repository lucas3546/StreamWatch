namespace StreamWatch.Application.Common.Models;

public record ExtendedMediaModel(string FileName, string ThumbnailFileName, string MediaProvider, decimal Size, DateTime? expiresAt);