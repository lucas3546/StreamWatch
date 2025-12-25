using System;

namespace StreamWatch.Application.Common.Interfaces;

public interface IRealtimeMessengerService
{
    Task SendToGroupAsync(string group, string method, object obj);

    Task SendToUserAsync(string userId, string method, params object[] args);
    Task SendToUsersAsync(string userId, string userId2,string method, object obj);
    Task SendToUserAsync(string userId, string method, object obj);

    Task BroadcastAsync(string method, params object[] args);
    Task SendToClientAsync(string connectionId, string method, object obj);

    
}
