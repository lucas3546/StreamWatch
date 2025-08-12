using System.ComponentModel.DataAnnotations;
using StreamWatch.Application.Common.Attributes;

namespace StreamWatch.Application.Requests;

public record GetPresignedUrlRequest
{
    [AllowedExtensions("mp4", "avi", "mov")]
    public required string FileName { get; init; }
    public required string ContentType { get; init; }
    [Range(1, 20000000)]
    public required decimal Size { get; init; }
}