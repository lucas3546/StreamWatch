using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Application.Common.Interfaces;

public interface IAccountStorageService
{
    Task<Result<GetPresignedUrlResponse>> GetPresignedUrl(GetPresignedUrlRequest request);
    Task<Result> SetMediaFileUploaded(SetMediaFileUploadedRequest request);
    Task<Result<UploadImageResponse>> UploadImageAsync(UploadImageRequest request);
    Task<IEnumerable<MediaModel>> GetAllMediaFiles();
    Task<GetStorageOverviewResponse> GetStorageOverview();
    Task<Result> RemoveMedia(Guid mediaId);
    Task<GetUserFullStorageOverviewResponse> GetUserFullStorageOverview(string accountId);
}