using StreamWatch.Application.Common.Models;

namespace StreamWatch.Application.Common.Interfaces;

public interface IStorageService
{
    Task<UploadedFile> UploadAsync(Stream fileStream, string fileName, string contentType);
    Task DeleteAsync(string fileUrl);
    string GetUrl(string filePath);
}