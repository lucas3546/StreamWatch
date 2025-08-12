using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]/")]
public class AccountStorageController : ControllerBase
{
    private readonly IAccountStorageService _accountStorage;

    public AccountStorageController(IAccountStorageService accountStorage)
    {
        _accountStorage = accountStorage;
    }

    [HttpPost("prepare-upload")]
    [Authorize]
    public async Task<ActionResult<GetPresignedUrlResponse>> PrepareUpload(GetPresignedUrlRequest request)
    {
        var response = await _accountStorage.GetPresignedUrl(request);
        
        return response.ToActionResult(HttpContext);
    }
    
}