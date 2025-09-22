using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
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
    public async Task<ActionResult<string>> Register(RegisterAccountRequest request)
    {
        var response = await _accountService.RegisterAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Authenticate user and return a JWT")]
    public async Task<ActionResult<string>> Login(LoginAccountRequest request)
    {
        var response = await _accountService.AuthenticateAsync(request);

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


    [HttpGet("search/paged")]
    [Authorize]
    public async Task<ActionResult<PaginatedList<UserSearchResultModel>>> SearchUsers([FromQuery] SearchUsersPagedRequest request)
    {
        var response = await _accountService.SearchUsersPagedAsync(request);

        return Ok(response);
    }
}
