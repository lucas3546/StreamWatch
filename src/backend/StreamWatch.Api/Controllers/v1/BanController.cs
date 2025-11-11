using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
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
}    

