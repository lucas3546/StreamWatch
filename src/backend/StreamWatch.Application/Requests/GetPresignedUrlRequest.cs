using System.ComponentModel.DataAnnotations;
using StreamWatch.Application.Common.Attributes;

namespace StreamWatch.Application.Requests;

public record GetPresignedUrlRequest
{
    [AllowedExtensions("mp4", "avi", "mov")]
    public required string FileName { get; init; }
    [MaxUsagePerUser]
    public required long Size { get; init; }
}