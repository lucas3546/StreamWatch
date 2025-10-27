using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("v1/[controller]/")]
public class AccountStorageController : ControllerBase
{
    private readonly IAccountStorageService _accountStorage;

    public AccountStorageController(IAccountStorageService accountStorage)
    {
        _accountStorage = accountStorage;
    }

    [HttpPost("prepare-upload")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(
        Summary = "Genereate a presigned url",
        Description = "Generate presigned url to upload files on S3 Bucket, NOTE: This don't work when the storage is set to Local"
    )]
    public async Task<ActionResult<GetPresignedUrlResponse>> PrepareUpload(
        GetPresignedUrlRequest request
    )
    {
        var response = await _accountStorage.GetPresignedUrl(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpPost("set-uploaded")]
    public async Task<ActionResult> SetFileUploaded(SetMediaFileUploadedRequest request)
    {
        var response = await _accountStorage.SetMediaFileUploaded(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("overview")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(
        Summary = "List all uploaded media files",
        Description = "Retrieves a list of all media files stored in the current user's account storage."
    )]
    public async Task<ActionResult<GetStorageOverviewResponse>> GetStorageOverview()
    {
        var response = await _accountStorage.GetStorageOverview();

        return Ok(response);
    }
}
