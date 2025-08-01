using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
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
    public async Task<ActionResult> SendInvitation([FromBody] string UserName)
    {
        var response = await _friendshipService.SendInvitationAsync(UserName);

        return response.ToActionResult(HttpContext);
    }

}