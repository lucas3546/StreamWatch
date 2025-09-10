using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]/")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }
    [HttpPost("Create")]
    public async Task<ActionResult<CreateRoomResponse>> Create(CreateRoomRequest request)
    {
        var response = await _roomService.CreateRoomAsync(request);
        
        return response.ToActionResult(HttpContext);
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PaginatedList<GetPagedRoomItemResponse>>> GetPaged([FromQuery] GetPagedRoomsRequest request)
    {
        var response = await _roomService.GetPagedRooms(request);

        return Ok(response);
    }
}