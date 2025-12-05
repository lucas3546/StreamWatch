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
public class BanController : ControllerBase
{
    private readonly IBanService _banService;
    public BanController(IBanService banService)
    {
        _banService = banService;
    }
    [HttpPost("ban-account")]
    public async Task<ActionResult<string>> Ban(BanAccountRequest request)
    {
        var response = await _banService.BanAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("get-current-ban")]
    public async Task<ActionResult<GetActiveBanForCurrentUserResponse>> GetBanDetails()
    {
        var response = await _banService.GetActiveBanForCurrentUser();

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("history/{accountId}")]
    public async Task<ActionResult<IEnumerable<GetBansHistoryFromUserItemResponse>>> GetBansHistoryFromUser(string accountId)
    {
        var response = await _banService.GetBansHistoryFromUser(accountId);

        return Ok(response);
    }

    [HttpDelete("unban/{accountId}")]
    public async Task<ActionResult> Unban(string accountId)
    {
        var response = await _banService.UnbanAsync(accountId);

        return response.ToActionResult(HttpContext);
    }
}    

