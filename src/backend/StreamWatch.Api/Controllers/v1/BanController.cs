using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Infraestructure.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Entities;

namespace StreamWatch.Api.Controllers.v1;

[Route("v1/[controller]")]
[ApiController]
[Authorize(Policy = "Moderation")]
public class BanController : ControllerBase
{
    private readonly IBanService _banService;
    public BanController(IBanService banService)
    {
        _banService = banService;
    }
    [HttpPost("ban-account")]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<string>> Ban(BanAccountRequest request)
    {
        var response = await _banService.BanAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("get-current-ban")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(GetActiveBanForCurrentUserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<GetActiveBanForCurrentUserResponse>> GetBanDetails()
    {
        var response = await _banService.GetActiveBanForCurrentUser();

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("history/{accountId}")]
    [ProducesResponseType(typeof(IEnumerable<GetBansHistoryFromUserItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<GetBansHistoryFromUserItemResponse>>> GetBansHistoryFromUser(string accountId)
    {
        var response = await _banService.GetBansHistoryFromUser(accountId);

        return Ok(response);
    }

    [HttpDelete("unban/{accountId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Unban(string accountId)
    {
        var response = await _banService.UnbanAsync(accountId);

        return response.ToActionResult(HttpContext);
    }
}    

