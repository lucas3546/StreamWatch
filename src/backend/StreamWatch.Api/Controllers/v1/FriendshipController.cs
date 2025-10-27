using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using StreamWatch.Api.Extensions;
using StreamWatch.Api.Hubs;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("v1/[controller]/")]
public class FriendshipController  : ControllerBase
{
    private readonly IFriendshipService _friendshipService;
    private readonly IHubContext<StreamWatchHub> _hubContext;
    public FriendshipController(IFriendshipService friendshipService, IHubContext<StreamWatchHub> hubContext)
    {
        _friendshipService = friendshipService;
        _hubContext = hubContext;
    }

    [HttpGet("all")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Get all friends", Description = "Get all friends from the current user")]
    public async Task<ActionResult<IEnumerable<FriendModel>>> GetAllFriendsAsync()
    {
        var response = await _friendshipService.GetAllFriendsAsync();
        
        return response.ToActionResult(HttpContext);
    }
    
    [HttpGet("paged")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Get paged friends", Description = "Get paged friends from the current user")]
    public async Task<ActionResult<PaginatedList<FriendModel>>> GetPagedFriends([FromQuery] GetPagedFriendsRequest request)
    {
        var response = await _friendshipService.GetPagedFriendsAsync(request);
        
        return response.ToActionResult(HttpContext);
    }

    [HttpGet("status/{userId}")]
    [Authorize]
    public async Task<ActionResult<GetFriendshipStatusResponse>> GetFriendshipStatus(string userId)
    {
        var response = await _friendshipService.GetFriendshipStatusAsync(userId);

        return response.ToActionResult(HttpContext);
    }


    [HttpPost("requests/send/{targetUserId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Send friendship request", Description = "Send friendship request to another user")]
    public async Task<ActionResult> SendFriendshipInvitation(string targetUserId)
    {
        var response = await _friendshipService.SendFriendshipInvitationAsync(targetUserId);

        return response.ToActionResult(HttpContext);
    }

    [HttpPut("requests/accept/{targetUserId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Accept friendship invitation", Description = "Accept friendship request from another user")]
    public async Task<ActionResult> AcceptFriendshipInvitation(string targetUserId)
    {
        var response = await _friendshipService.AcceptFriendshipInvitationAsync(targetUserId);
        
        return response.ToActionResult(HttpContext);
    }

    
    
    [HttpDelete("remove/{targetUserId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Remove friendship or request", Description = "Remove, cancel or decline friendship")]
    public async Task<ActionResult> RemoveFriend(string targetUserId)
    {
        var response = await _friendshipService.RemoveFriendAsync(targetUserId);
        
        return response.ToActionResult(HttpContext);
    }


    

}