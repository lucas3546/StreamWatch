namespace StreamWatch.Application.Common.Interfaces;

public interface IMediaProcessingService
{
    Stream ResizeImage(Stream inputStream, int width, int height, string format = "webp");
    Stream ConvertImageFormat(Stream inputStream, string format = "webp");
    Task<Stream> GenerateThumbnailStreamAsync(string videoUrl);
    Task<Stream> GenerateThumbnailFromFileAsync(string filePath);
}