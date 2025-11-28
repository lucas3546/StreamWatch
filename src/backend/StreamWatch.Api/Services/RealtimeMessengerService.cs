using System;
using Microsoft.AspNetCore.SignalR;
using StreamWatch.Api.Hubs;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Api.Services;

public class RealtimeMessengerService : IRealtimeMessengerService
{
    private readonly IHubContext<StreamWatchHub> _hubContext;

    public RealtimeMessengerService(IHubContext<StreamWatchHub> hubContext)
    {
        _hubContext = hubContext;
    }
    public Task BroadcastAsync(string method, params object[] args)
    {
        throw new NotImplementedException();
    }

    public async Task SendToGroupAsync(string group, string method, object obj)
    {
        await _hubContext.Clients.Group(group).SendAsync(method, obj);
    }

    public async Task SendToUserAsync(string userId, string method, params object[] args)
    {
        await _hubContext.Clients.User(userId).SendAsync(method, args);
    }

    public async Task SendToUsersAsync(string userId, string userId2, string method, object obj)
    {
        await _hubContext.Clients.Users(userId, userId2).SendAsync(method, obj);
    }

        public async Task SendToUserAsync(string userId, string method, object obj)
    {
        await _hubContext.Clients.User(userId).SendAsync(method, obj);
    }
}
