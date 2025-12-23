using MaxMind.GeoIP2.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.SignalR;
using StreamWatch.Api.Infraestructure.Extensions;
using StreamWatch.Api.Hubs;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Constants;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("v1/[controller]/")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;
    private readonly IRoomInvitationService _roomInvitationService;
    private readonly IAccountStorageService _accountStorageService;
    private readonly IHubContext<StreamWatchHub> _hubContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<RoomsController> _logger;

    public RoomsController(
        IRoomService roomService,
        IRoomInvitationService roomInvitationService,
        IAccountStorageService accountStorageService,
        IHubContext<StreamWatchHub> hubContext,
        ICurrentUserService currentUserService,
        ILogger<RoomsController> logger
    )
    {
        _roomService = roomService;
        _roomInvitationService = roomInvitationService;
        _accountStorageService = accountStorageService;
        _hubContext = hubContext;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    [HttpPost("create")]
    [Authorize]
    //[EnableRateLimiting("OnceEvery5Minutes")]
    public async Task<ActionResult<CreateRoomResponse>> Create(CreateRoomRequest request)
    {
        _logger.LogInformation("Creating a room {@Request}", request);

        var response = await _roomService.CreateRoomAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpPut("update")]
    [Authorize]
    public async Task<ActionResult> Update(UpdateRoomRequest request)
    {
        var response = await _roomService.UpdateRoomAsync(request);

        if (response.IsSuccess)
        {
            await _hubContext.Clients.Group(request.Id.ToString()).SendAsync("RoomUpdated", new RoomUpdatedModel(request.Title, request.Category.ToString(), request.IsPublic));

            return response.ToActionResult(HttpContext);
        }
        return response.ToActionResult(HttpContext);
        
    }

    [HttpGet("paged")]
    public async Task<ActionResult<PaginatedList<GetPagedRoomItemResponse>>> GetPaged([FromQuery] GetPagedRoomsRequest request)
    {
        _logger.LogInformation("Fetching paged rooms with filter: {@Request}", request);
        var response = await _roomService.GetPagedRooms(request);

        return Ok(response);
    }


    [HttpPost("send-message")]
    [Authorize]
    public async Task<ActionResult> SendMessageAsync([FromForm] SendMessageRequest request)
    {
        _logger.LogInformation("Sending a message to the room Room={@RoomId} from UserId={@UserId}", request.RoomId, _currentUserService.Id);

        var userName = _currentUserService.Name;

        var role = _currentUserService.Role;

        var room = await _roomService.GetRoomByIdAsync(request.RoomId);

        if (room is null)
            return NotFound();

        string? uploadedFileName = null;

        if (request.Image != null)
        {
            var uploadImageRequest = new UploadImageRequest(
                request.Image.FileName,
                request.Image.ContentType,
                request.Image.OpenReadStream(),
                UploadOnlyThumbnail: true,
                DateTime.UtcNow.AddMinutes(10)
            );

            var uploadedFile = await _accountStorageService.UploadImageAsync(uploadImageRequest);
            if (!uploadedFile.IsSuccess)
            {
                return BadRequest(uploadedFile.Error);
            }

            uploadedFileName = uploadedFile.Data?.thumbPublicUrl;
        }

        string countryName = "Unknown";
        string countryIso = "Unknown";
        try
        {
            countryName = _currentUserService.Country.name ?? "Unknown";
            countryIso = _currentUserService.Country.isoCode ?? "Unknown";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unable to get country and iso name for UserId={@UserId}", _currentUserService.Id);
        }

        await _hubContext
            .Clients.Group(request.RoomId)
            .SendAsync(
                "ReceiveMessage",
                new
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = userName,
                    CountryCode = countryIso,
                    CountryName = countryName,
                    Text = request.Message,
                    Image = uploadedFileName,
                    UserId = _currentUserService.Id,
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

    [HttpPost("invite")]
    [Authorize]
    public async Task<ActionResult> InviteFriendToRoom(InviteToRoomRequest request)
    {
        var result = await _roomInvitationService.InviteToRoomAsync(request);

        return result.ToActionResult(HttpContext);
    }

    
}
