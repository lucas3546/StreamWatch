using MaxMind.GeoIP2.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using StreamWatch.Api.Extensions;
using StreamWatch.Api.Hubs;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Constants;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]/")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;
    private readonly IAccountStorageService _accountStorageService;
    private readonly IHubContext<StreamWatchHub> _hubContext;
    private readonly ICurrentUserService _currentUserService;

    public RoomsController(
        IRoomService roomService,
        IAccountStorageService accountStorageService,
        IHubContext<StreamWatchHub> hubContext,
        ICurrentUserService currentUserService
    )
    {
        _roomService = roomService;
        _accountStorageService = accountStorageService;
        _hubContext = hubContext;
        _currentUserService = currentUserService;
    }

    [HttpPost("Create")]
    public async Task<ActionResult<CreateRoomResponse>> Create(CreateRoomRequest request)
    {
        var response = await _roomService.CreateRoomAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PaginatedList<GetPagedRoomItemResponse>>> GetPaged(
        [FromQuery] GetPagedRoomsRequest request
    )
    {
        var response = await _roomService.GetPagedRooms(request);

        return Ok(response);
    }

    [HttpPost("send-message")]
    [Authorize]
    public async Task<ActionResult> SendMessageAsync([FromForm] SendMessageRequest request)
    {
        var userName = _currentUserService.Name;

        var role = _currentUserService.Role;

        string? countryCode = null;
        string? countryName = null;
        if (role != null && role == Roles.Admin)
        {
            countryCode = "staff";
            countryName = "staff";
        }
        else
        {
            (countryCode, countryName) = _currentUserService.Country;
        }

        var room = await _roomService.GetRoomByIdAsync(request.RoomId);

        if (room is null)
            return NotFound();

        string? uploadedFileName = null;

        if (request.Image != null)
        {
            var uploadImageRequest = new UploadImageRequest(
                request.Image.FileName,
                request.Image.OpenReadStream(),
                true,
                DateTime.UtcNow.AddMinutes(10)
            );

            var uploadedFile = await _accountStorageService.UploadImageAsync(uploadImageRequest);
            if (!uploadedFile.IsSuccess)
            {
                return BadRequest(uploadedFile.Error);
            }

            uploadedFileName = uploadedFile.Data?.thumbPublicUrl;
        }

        await _hubContext
            .Clients.Group(request.RoomId)
            .SendAsync(
                "ReceiveMessage",
                new
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = userName,
                    CountryCode = "ar",
                    CountryName = "Argentina",
                    Text = request.Message,
                    Image = uploadedFileName,
                    ReplyToMessageId = request.ReplyToMessageId,
                }
            );

        return Ok();
    }

    [HttpPost("playlist/add")]
    public async Task<ActionResult<PlaylistVideoItem>> AddVideoToPlaylist(AddVideoToPlaylistRequest request)
    {
        var result = await _roomService.AddVideoToPlaylist(request);

        await _hubContext.Clients.Group(request.RoomId).SendAsync("NewPlaylistVideo", result.Data);

        return result.ToActionResult(HttpContext);
    }
}
