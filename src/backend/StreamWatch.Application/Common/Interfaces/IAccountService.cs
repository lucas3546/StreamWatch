using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;

namespace StreamWatch.Application.Common.Interfaces;

public interface IAccountService
{
    Task<Result<string>> AuthenticateAsync(LoginAccountRequest request);
    Task<Result<string>> RegisterAsync(RegisterAccountRequest request);
    Task<Result> SetProfilePictureAsync(UpdateProfilePicRequest request);
}