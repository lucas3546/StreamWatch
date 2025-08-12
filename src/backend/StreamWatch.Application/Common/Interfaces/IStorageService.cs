using StreamWatch.Application.Common.Models;

namespace StreamWatch.Application.Common.Interfaces;

public interface IStorageService
{
    Task<UploadedFile> UploadAsync(Stream fileStream, string fileName, string contentType);
    Task DeleteAsync(string fileName);
    Task<string> GetPresignedUrl(string fileName, string contentType, DateTime expiresAt);
    Task<UploadedFile> GetFileMetadataAsync(string fileName);
    string GetUrl(string filePath);
}