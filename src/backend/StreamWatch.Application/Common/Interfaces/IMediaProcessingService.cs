namespace StreamWatch.Application.Common.Interfaces;

public interface IMediaProcessingService
{
    Task<Stream> GenerateThumbnailFromImageAsync(Stream input, bool isAnimated = false);
    Task<Stream> GenerateThumbnailFromVideoUrlAsync(string videoUrl);
    Task<Stream> GenerateThumbnailFromFileAsync(string filePath);
}