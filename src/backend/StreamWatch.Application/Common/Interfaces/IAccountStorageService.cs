using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Application.Common.Interfaces;

public interface IAccountStorageService
{
    Task<Result<GetPresignedUrlResponse>> GetPresignedUrl(GetPresignedUrlRequest request);
}