using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
        
        if(user.RoomId != null) await Groups.RemoveFromGroupAsync(connectionId, user.RoomId);
        
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
        
        await Groups.AddToGroupAsync(connectionId, roomId);
        
        return room;
    }

    [Authorize]
    public async Task UpdateVideoState(UpdateVideoStateRequest request)
    { 
        var connectionId = GetConnectionId();

        var room = await _roomService.GetRoomByIdAsync(request.RoomId);
        if(room is null) throw new HubException("Room not found");
        
        var user = await _userSessionService.GetUserSessionAsync(connectionId);
        if(user is null) throw new HubException("User not found");

        if (user.UserId != room.LeaderAccountId) throw new HubException("User is not the leader account");

        var result = await _roomService.UpdateVideoStateAsync(request);
        if(!result.IsSuccess) throw new HubException("Error while updating video state");
        
        await Clients.Group(request.RoomId).SendAsync("RoomVideoStateUpdated", request.CurrentTimestamp, request.SentAt, request.IsPaused);
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