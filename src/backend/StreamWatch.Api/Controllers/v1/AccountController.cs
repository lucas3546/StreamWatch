using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Requests;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]/")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;
    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
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
        var response = await _accountService.SetProfilePictureAsync(request);
        
        return response.ToActionResult(HttpContext);
    }
    
}