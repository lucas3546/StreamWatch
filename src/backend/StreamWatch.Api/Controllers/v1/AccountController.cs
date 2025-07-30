using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Requests;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]/[action]")]
public class AccountController : ControllerBase
{
    private readonly IAccountService _accountService;
    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }
    
    [HttpGet]
    [SwaggerOperation(Summary = "Make a ping", Description = "Get a pong!")]
    public IActionResult Ping()
    {
        return Ok("Pong");
    }

    [HttpPost]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [SwaggerOperation(Summary = "Register a new user account and get jwt")]
    public async Task<ActionResult<string>> Register(RegisterAccountRequest request)
    {
        var response = await _accountService.RegisterAsync(request);

        return response.ToActionResult(HttpContext);
    }
}