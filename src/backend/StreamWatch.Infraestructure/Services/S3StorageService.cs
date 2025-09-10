using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
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

    public S3StorageService(IOptions<StorageOptions> options, IAmazonS3 s3)
    {
        _bucketName = options.Value.S3.Bucket;
        _publicUrl = options.Value.PublicUrl;
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
            DisablePayloadSigning = true,
        };
        
        var response = await _s3.PutObjectAsync(request);
        
        return new UploadedFile(fileName, _bucketName, request.ContentType, null, null);
    }

    public Task DeleteAsync(string fileName)
    {
        var response = _s3.DeleteObjectAsync(_bucketName, fileName);

        return Task.CompletedTask;
    }

    public async Task<string> GetPresignedUrl(string fileName, string contentType,DateTime expiresAt)
    {
        var presign = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = expiresAt,
            ContentType = contentType,
        };
        var presignedUrl = await _s3.GetPreSignedURLAsync(presign);
        
        return presignedUrl;
    }
    
    public async Task<UploadedFile?> GetFileMetadataAsync(string fileName)
    {
        var request = new GetObjectMetadataRequest()
        {
            BucketName = _bucketName,
            Key = fileName,
        };
        
        var response = await _s3.GetObjectMetadataAsync(request);
        
        return new UploadedFile(fileName, _bucketName, response.Headers.ContentType, response.Headers.ContentLength, null);
    }

    public async Task<UploadedFile?> GetPartialVideoAsync(string fileName, long startByte, long endByte)
    {
        var request = new GetObjectRequest()
        {
            BucketName = _bucketName,
            Key = fileName,
            ByteRange = new ByteRange(startByte, endByte)
        };
        
        var response = await _s3.GetObjectAsync(request);
        
        var memory = new MemoryStream();
        await response.ResponseStream.CopyToAsync(memory);
        memory.Position = 0;
        
        return new UploadedFile(response.Key, _bucketName, response.Headers.ContentType, response.Headers.ContentLength, memory);
    }
    

    public string GetUrl(string filePath)
    {
        return $"{_publicUrl}/{filePath}";
    }
}