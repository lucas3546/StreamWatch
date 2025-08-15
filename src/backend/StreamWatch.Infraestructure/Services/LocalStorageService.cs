using Microsoft.Extensions.Options;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Options;

namespace StreamWatch.Infraestructure.Services;

public class LocalStorageService : IStorageService
{
    private readonly string _basePath;
    private readonly string _publicUrl;

    public LocalStorageService(IOptions<StorageOptions> options)
    {
        _basePath = options.Value.BaseLocalPath;
        _publicUrl = options.Value.PublicUrl;
    }
    public async Task<UploadedFile> UploadAsync(Stream fileStream, string fileName, string contentType)
    {
        var relativePath = Path.Combine("media", fileName);
        var fullPath = Path.Combine(_basePath, relativePath);

        Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

        using var file = File.Create(fullPath);
        await fileStream.CopyToAsync(file);
        
        return new UploadedFile(fileName, MediaProvider.Local, null, contentType, null, null);
    }

    public Task DeleteAsync(string fileName)
    {
        var relativePath = Path.Combine("media", fileName);
        var fullPath = Path.Combine(_basePath, relativePath);
        
        try
        {
            File.Delete(fullPath);
        }
        catch (Exception ex)
        {
            throw new IOException($"Error deleting file: {fullPath}", ex);
        }
        
        return Task.CompletedTask;
    }

    public Task<string> GetPresignedUrl(string fileName, string contentType,DateTime expiresAt)
    {
        throw new Exception("Invalid endpoint, the current configuration is using LocalSotrage, not S3.");
    }

    public Task<UploadedFile> GetFileMetadataAsync(string fileName)
    {
        throw new NotImplementedException();
    }

    public Task<UploadedFile?> GetPartialVideoAsync(string fileName, long startByte, long endByte)
    {
        throw new NotImplementedException();
    }


    public string GetUrl(string filePath)
    {
        return $"{_publicUrl}/media/{filePath}";
    }
}