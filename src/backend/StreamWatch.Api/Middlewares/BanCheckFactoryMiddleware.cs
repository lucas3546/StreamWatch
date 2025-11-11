using System;
using Microsoft.AspNetCore.Mvc;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Api.Middlewares;

public class BanCheckFactoryMiddleware : IMiddleware
{
    private readonly IBanCacheService _banCacheService;
    private readonly ICurrentUserService _user;
    public BanCheckFactoryMiddleware(IBanCacheService banCacheService, ICurrentUserService currentUserService)
    {
        _banCacheService = banCacheService;
        _user = currentUserService;
    }


    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        string? userId = _user.Id;
        string? ipAddress = _user.IpAddress;

        ArgumentException.ThrowIfNullOrEmpty(ipAddress);

        
        bool hasActiveBan = await _banCacheService.IsAccountBannedAsync(userId ?? "", ipAddress);

            if (hasActiveBan)
            {
                if (context.Request.Path.HasValue && context.Request.Path.Value.Contains("get-current-ban", StringComparison.OrdinalIgnoreCase))
                {
                    await next(context);
                    return;
                }

                context.Response.StatusCode = StatusCodes.Status423Locked;
                var problem = new ValidationProblemDetails
                {
                    Status = StatusCodes.Status423Locked,
                    Title = "User banned",
                    Detail = "UserHasBeenBanned",
                    Type = "UserBanned",
                    Instance = context.Request.Path
                };

                await context.Response.WriteAsJsonAsync(problem);
                return; 
            }

        await next(context);
    }
}
