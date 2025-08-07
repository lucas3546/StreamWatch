using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Options;

namespace StreamWatch.Infraestructure.Services;

public class LocalStorageService : IStorageService
{
    private readonly string _basePath;
    private readonly string _publicUrl;
    public LocalStorageService(StorageOptions options)
    {
        _basePath = options.BaseLocalPath;
        _publicUrl = options.PublicUrl;
    }
    public async Task<UploadedFile> UploadAsync(Stream fileStream, string fileName, string contentType)
    {
        var relativePath = Path.Combine("media", fileName);
        var fullPath = Path.Combine(_basePath, relativePath);

        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        using var file = File.Create(fullPath);
        await fileStream.CopyToAsync(file);
        
        return new UploadedFile(fileName, MediaProvider.Local, null);
    }

    public Task DeleteAsync(string fileUrl)
    {
        throw new NotImplementedException();
    }

    public string GetUrl(string filePath)
    {
        return $"{_publicUrl}/media/{filePath}";
    }
}