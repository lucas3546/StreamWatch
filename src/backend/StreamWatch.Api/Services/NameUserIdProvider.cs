using System;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace StreamWatch.Api.Services;

public class NameUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}
