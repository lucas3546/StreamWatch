namespace StreamWatch.Application.Common.Interfaces;

public interface IStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType);
    Task DeleteAsync(string fileUrl);
    string GetUrl(string filePath);
}