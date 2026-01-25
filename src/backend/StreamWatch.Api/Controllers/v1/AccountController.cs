using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Infraestructure.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Errors;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("v1/[controller]/")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;
    private readonly IAccountStorageService _accountStorageService;

    public AccountController(IAccountService accountService, IAccountStorageService accountStorageService)
    {
        _accountService = accountService;
        _accountStorageService = accountStorageService;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(RegisterAccountResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Register a new user account and return a JWT")]
    public async Task<ActionResult<RegisterAccountResponse>> Register(RegisterAccountRequest request)
    {
        var response = await _accountService.RegisterAsync(request);

        if(response.IsSuccess)
        {
            Response.Cookies.Append("X-Refresh-Token", response.Data.refreshToken, new CookieOptions() { HttpOnly = true, Secure = false, SameSite = SameSiteMode.Unspecified, Expires = DateTimeOffset.UtcNow.AddHours(3), Domain = "localhost" });
            
            return response.ToActionResult(HttpContext);
        }

        return response.ToActionResult(HttpContext);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthenticateAccountResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Authenticate user and return a JWT")]
    public async Task<ActionResult<AuthenticateAccountResponse>> Login(LoginAccountRequest request)
    {
        var response = await _accountService.AuthenticateAsync(request);

        if(response.IsSuccess)
        {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            Response.Cookies.Append("X-Refresh-Token", response.Data.refreshToken, new CookieOptions() { HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax, Expires = DateTimeOffset.UtcNow.AddHours(3) });
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            return response.ToActionResult(HttpContext);
        }

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("refresh")]
    [ProducesResponseType(typeof(RefreshTokenResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [Authorize]
    [SwaggerOperation(Summary = "Refresh jwt token")]
    public async Task<ActionResult<RefreshTokenResponse>> Refresh()
    {
        if (!Request.Cookies.TryGetValue("X-Refresh-Token", out var refreshToken)) return BadRequest("You don't have a refresh token in the cookie!");

        var response = await _accountService.RefreshToken(refreshToken);

        if (response.IsSuccess)
        {
            Response.Cookies.Append("X-Refresh-Token", response.Data.refreshToken, new CookieOptions() { HttpOnly = true, Secure = false, SameSite = SameSiteMode.Lax, Expires = DateTimeOffset.UtcNow.AddHours(3) });

            return response.ToActionResult(HttpContext);
        }

        return response.ToActionResult(HttpContext);
    }

    [HttpPost("profile/set-picture")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Set profile pic of current user")]
    public async Task<ActionResult> SetProfilePicture(UpdateProfilePicRequest request)
    {
        string fileName = "profile_pic" + Guid.NewGuid();
        var uploadRequest = new UploadImageRequest(fileName, request.Picture.ContentType,request.Picture.OpenReadStream(), true, null);

        var uploadResponse = await _accountStorageService.UploadImageAsync(uploadRequest);

        if (!uploadResponse.IsSuccess || uploadResponse.Data is null) return BadRequest();

        var response = await _accountService.SetProfilePictureAsync(uploadResponse.Data.MediaId);

        return response.ToActionResult(HttpContext);
    }

    [HttpPut("change-password")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Change password of current user")]
    public async Task<ActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var response = await _accountService.ChangePasswordAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpPut("change-username")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Change username of current user")]
    public async Task<ActionResult> ChangeUsername(ChangeUsernameRequest request)
    {
        var result = await _accountService.ChangeUsernameAsync(request.newUsername);

        return result.ToActionResult(HttpContext);
    }

    [HttpGet("profile/{userId}")]
    [Authorize]
    [ProducesResponseType(typeof(GetBasicUserProfileDataResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Get a user's basic profile")]
    public async Task<ActionResult<GetBasicUserProfileDataResponse>> GetBasicUserDataProfile(string userId)
    {
        var response = await _accountService.GetBasicUserProfileDataAsync(userId);

        return response.ToActionResult(HttpContext);
    }


    [HttpGet("search/paged")]
    [Authorize]
    [ProducesResponseType(typeof(PaginatedList<UserSearchResultModel>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PaginatedList<UserSearchResultModel>>> SearchUsers([FromQuery] SearchUsersPagedRequest request)
    {
        var response = await _accountService.SearchUsersPagedAsync(request);

        return Ok(response);
    }

    [HttpDelete("delete-current")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> DeleteCurrentAccount()
    {
        var response = await _accountService.DeleteCurrentAccountAsync();

        return response.ToActionResult(HttpContext);
    }

}
