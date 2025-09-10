using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Cache;

namespace StreamWatch.Api.Hubs;

public class StreamWatchHub : Hub
{
    private readonly IUserSessionService _userSessionService;
    private readonly IRoomService _roomService;
    public StreamWatchHub(IUserSessionService userSessionService, IRoomService roomService)
    {
        _userSessionService = userSessionService;
        _roomService = roomService;
    }
    
    public override Task OnConnectedAsync()
    {
        var userId = GetUserId();

        var profilePic = GetProfilePic();

        var userName = GetUsername();
        
        var connectionId = GetConnectionId();
        
        var request = new CreateSessionRequest(userName, userId, profilePic, connectionId);

        _userSessionService.CreateSessionAsync(request);
        
        return base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var connectionId = GetConnectionId();
        
        var user = await _userSessionService.GetUserSessionAsync(connectionId);
        
        await _userSessionService.EndSessionAsync(connectionId);
        
        await base.OnDisconnectedAsync(exception);
    }

    public async Task<RoomCache> ConnectToRoom(string roomId)
    {
        var connectionId = GetConnectionId();
        if(string.IsNullOrEmpty(roomId)) throw new HubException("No connection id found");
        
        var room = await _roomService.GetRoomByIdAsync(roomId);
        
        if(room is null) throw new HubException("Room not found");
        
        var result = await _userSessionService.AddToRoom(connectionId, roomId);
        
        if(!result.IsSuccess) throw new HubException("Error while adding user session to room");
        
        return room;
    }
    

    private string GetConnectionId()
    {
        return Context.ConnectionId;
    }
    
    private string? GetUserId()
    {
        return Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    private string? GetUsername()
    {
        return Context.User?.FindFirst(JwtRegisteredClaimNames.Name)?.Value;
    }

    private string? GetProfilePic()
    {
        return Context.User?.FindFirst(JwtRegisteredClaimNames.Picture)?.Value;
    }
}