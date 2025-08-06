using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]/")]
public class FriendshipController  : ControllerBase
{
    private readonly IFriendshipService _friendshipService;
    public FriendshipController(IFriendshipService friendshipService)
    {
        _friendshipService = friendshipService;
    }

    [HttpPost("invitations/send")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Send friendship request", Description = "Send friendship request to another user")]
    public async Task<ActionResult> SendFriendshipInvitation(SendFriendshipInvitationRequest request)
    {
        var response = await _friendshipService.SendFriendshipInvitationAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpPut("invitations/accept")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Accept friendship invitation", Description = "Accept friendship invitation from another user")]
    public async Task<ActionResult> AcceptFriendshipInvitation(AcceptFriendshipInvitationRequest request)
    {
        var response = await _friendshipService.AcceptFriendshipInvitationAsync(request);
        
        return response.ToActionResult(HttpContext);
    }
    
    [HttpPut("invitations/decline")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Decline friendship invitation", Description = "Decline friendship invitation from another user")]
    public async Task<ActionResult> DeclineFriendshipInvitation(DeclineFriendInvitationRequest request)
    {
        var response = await _friendshipService.DeclineFriendshipInvitationAsync(request);
        
        return response.ToActionResult(HttpContext);
    }
    
    [HttpDelete("remove")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Remove friendship", Description = "Remove friendship, enter the username of your friend")]
    public async Task<ActionResult> RemoveFriend(RemoveFriendRequest request)
    {
        var response = await _friendshipService.RemoveFriendAsync(request);
        
        return response.ToActionResult(HttpContext);
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

}