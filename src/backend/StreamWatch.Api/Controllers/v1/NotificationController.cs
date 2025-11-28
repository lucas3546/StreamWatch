using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Api.Extensions;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using Swashbuckle.AspNetCore.Annotations;

namespace StreamWatch.Api.Controllers.v1;

[ApiController]
[Route("v1/[controller]/")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet("paged")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Get paged notifications", Description = "Get paged notifications from current user")]
    public async Task<ActionResult<PaginatedList<NotificationModel>>> GetPagedNotificationsAsync([FromQuery] GetPagedNotificationsRequest request)
    {
        var response = await _notificationService.GetPagedNotificationsAsync(request);

        return response.ToActionResult(HttpContext);
    }

    [HttpDelete("clear")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    [SwaggerOperation(Summary = "Clear notifications", Description = "Remove all notifications from current user")]
    public async Task<ActionResult> ClearNotifications()
    {
        var response = await _notificationService.ClearNotificationsAsync();

        return response.ToActionResult(HttpContext);
    }

    [HttpDelete("remove/{notificationId}")]
    public async Task<ActionResult> RemoveNotification(int notificationId)
    {
        var response = await _notificationService.DeleteNotification(notificationId);

        return response.ToActionResult(HttpContext);
    }
    
    
}