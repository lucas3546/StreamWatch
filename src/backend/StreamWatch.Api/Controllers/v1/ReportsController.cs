using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StreamWatch.Api.Infraestructure.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Request;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Constants;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("v1/[controller]")]
[Authorize(Policy = "Moderation")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }


    [HttpPost("create")]
    [EnableRateLimiting("OnceEvery30Seconds")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<int>> Create(CreateReportRequest request)
    {
        var response = await _reportService.CreateAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("get/{id}")]
    [Authorize]
    [ProducesResponseType(typeof(GetReportResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<GetReportResponse>> GetById(int id)
    {
        var response = await _reportService.GetReportByIdAsync(id);

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("paged")]
    [Authorize]
    [ProducesResponseType(typeof(PaginatedList<GetReportPagedItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PaginatedList<GetReportPagedItemResponse>>> GetPaged([FromQuery] GetPagedReportsRequest request)
    {
        var response = await _reportService.GetPagedReportsAsync(request);

        return Ok(response);
    }

    [HttpPut("update-state")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> UpdateReportState(UpdateReportStateRequest request)
    {
        var response = await _reportService.UpdateReportStateAsync(request);

        return response.ToActionResult(HttpContext);
    }
}
