using System;

namespace StreamWatch.Application.Common.Interfaces;

public interface IRealtimeMessengerService
{
    Task SendToGroupAsync(string group, string method, object obj);

    Task SendToUserAsync(string userId, string method, params object[] args);

    Task BroadcastAsync(string method, params object[] args);

    Task SendToUserAsync(string userId, string method, object obj);
}
