using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Requests;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("api/v1/[controller]/[action]")]
public class FriendshipController  : ControllerBase
{
    private readonly IFriendshipService _friendshipService;
    public FriendshipController(IFriendshipService friendshipService)
    {
        _friendshipService = friendshipService;
    }

    [HttpPost]
    [Authorize]
    [SwaggerOperation(Summary = "Send friendship request", Description = "Send friendship request to another user")]
    public async Task<ActionResult> SendFriendshipInvitation(SendFriendshipInvitationRequest request)
    {
        var response = await _friendshipService.SendFriendshipInvitationAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpPut]
    [Authorize]
    [SwaggerOperation(Summary = "Accept friendship invitation", Description = "Accept friendship invitation from another user")]
    public async Task<ActionResult> AcceptFriendshipInvitation(AcceptFriendshipInvitationRequest request)
    {
        var response = await _friendshipService.AcceptFriendshipInvitationAsync(request);
        
        return response.ToActionResult(HttpContext);
    }
    
    [HttpPut]
    [Authorize]
    [SwaggerOperation(Summary = "Decline friendship invitation", Description = "Decline friendship invitation from another user")]
    public async Task<ActionResult> DeclineFriendshipInvitation(DeclineFriendInvitationRequest request)
    {
        var response = await _friendshipService.DeclineFriendshipInvitationAsync(request);
        
        return response.ToActionResult(HttpContext);
    }
    
    [HttpDelete]
    [Authorize]
    [SwaggerOperation(Summary = "Remove friendship", Description = "Remove friendship, enter the username of your friend")]
    public async Task<ActionResult> RemoveFriend(RemoveFriendRequest request)
    {
        var response = await _friendshipService.RemoveFriendAsync(request);
        
        return response.ToActionResult(HttpContext);
    }

}