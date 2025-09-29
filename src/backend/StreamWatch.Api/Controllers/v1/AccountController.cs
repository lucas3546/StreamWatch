using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Errors;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]/")]
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
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
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
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Authenticate user and return a JWT")]
    public async Task<ActionResult<AuthenticateAccountResponse>> Login(LoginAccountRequest request)
    {
        var response = await _accountService.AuthenticateAsync(request);

        if(response.IsSuccess)
        {
            Response.Cookies.Append("X-Refresh-Token", response.Data.refreshToken, new CookieOptions() { HttpOnly = true, Secure = false, SameSite = SameSiteMode.Unspecified, Expires = DateTimeOffset.UtcNow.AddHours(3), Domain = "localhost" });
            
            return response.ToActionResult(HttpContext);
        }

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("refresh")]
    [Authorize]
    public async Task<ActionResult<RefreshTokenResponse>> Refresh()
    {
        if (!Request.Cookies.TryGetValue("X-Refresh-Token", out var refreshToken)) return BadRequest("You don't have a refresh token in the cookie!");

        var response = await _accountService.RefreshToken(refreshToken);

        if (response.IsSuccess)
        {
            Response.Cookies.Append("X-Refresh-Token", response.Data.refreshToken, new CookieOptions() { HttpOnly = true, Secure = false, SameSite = SameSiteMode.Unspecified, Expires = DateTimeOffset.UtcNow.AddHours(3), Domain = "localhost" });

            return response.ToActionResult(HttpContext);
        }

        return response.ToActionResult(HttpContext);
    }

    [HttpPost("set-profile-pic")]
    public async Task<ActionResult> SetProfilePicture(UpdateProfilePicRequest request)
    {
        string fileName = "profile_pic" + Guid.NewGuid();
        var uploadRequest = new UploadImageRequest(fileName, request.Picture.OpenReadStream(), true, null);

        var uploadResponse = await _accountStorageService.UploadImageAsync(uploadRequest);

        if (!uploadResponse.IsSuccess || uploadResponse.Data is null) return BadRequest();

        var response = await _accountService.SetProfilePictureAsync(uploadResponse.Data.MediaId);

        return response.ToActionResult(HttpContext);
    }

    [HttpPut("change-username")]
    public async Task<ActionResult> ChangeUsername(ChangeUsernameRequest request)
    {
        var result = await _accountService.ChangeUsernameAsync(request.newUsername);

        return result.ToActionResult(HttpContext);
    }


    [HttpGet("search/paged")]
    [Authorize]
    public async Task<ActionResult<PaginatedList<UserSearchResultModel>>> SearchUsers([FromQuery] SearchUsersPagedRequest request)
    {
        var response = await _accountService.SearchUsersPagedAsync(request);

        return Ok(response);
    }
}
