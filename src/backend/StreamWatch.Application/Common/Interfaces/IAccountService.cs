using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Application.Common.Interfaces;

public interface IAccountService
{
    Task<Result<AuthenticateAccountResponse>> AuthenticateAsync(LoginAccountRequest request);
    Task<Result<RegisterAccountResponse>> RegisterAsync(RegisterAccountRequest request);
    Task<Result<GetBasicUserProfileDataResponse>> GetBasicUserProfileDataAsync(string userId);
    Task<Result<RefreshTokenResponse>> RefreshToken(string refreshToken);
    Task<Result> ChangePasswordAsync(ChangePasswordRequest request);
    Task<Result> SetProfilePictureAsync(Guid mediaId);
    Task<Result> ChangeUsernameAsync(string newUsername);
    Task<PaginatedList<UserSearchResultModel>> SearchUsersPagedAsync(SearchUsersPagedRequest request);
}