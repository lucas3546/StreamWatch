using Amazon.S3;
using Amazon.S3.Model;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Options;

namespace StreamWatch.Infraestructure.Services;

public class S3StorageService : IStorageService
{
    private readonly string _bucketName;
    private readonly string _publicUrl;
    private readonly IAmazonS3 _s3;
    public S3StorageService(StorageOptions options, IAmazonS3 s3)
    {
        _bucketName = options.S3.Bucket;
        _publicUrl = options.PublicUrl;
        _s3 = s3;
    }
    
    public async Task<UploadedFile> UploadAsync(Stream fileStream, string fileName, string contentType)
    {
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = fileName,
            InputStream = fileStream,
            ContentType = contentType,
            DisablePayloadSigning = true
        };
        
        var response = await _s3.PutObjectAsync(request);
        
        return new UploadedFile(fileName, MediaProvider.S3, _bucketName);
    }

    public Task DeleteAsync(string fileUrl)
    {
        throw new NotImplementedException();
    }

    public string GetUrl(string filePath)
    {
        return $"{_publicUrl}/{filePath}";
    }
}