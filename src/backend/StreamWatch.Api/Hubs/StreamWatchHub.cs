using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Enums;

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
        return base.OnConnectedAsync();
    }


    [Authorize]
    public async Task<RoomCache> ConnectToRoom(string roomId)
    {
        var room = await _roomService.GetRoomByIdAsync(roomId);

        if (room is null) throw new HubException("Room not found");

        var userId = GetUserId();

        var profilePic = GetProfilePic();

        var userName = GetUsername();

        var connectionId = GetConnectionId();

        //Get if user has a current session in the room
        var session = await _userSessionService.GetUserSessionInRoomAsync(roomId, userId);

        if (session is not null) throw new HubException("User has another session in the same room"); 

        //Create user session
        var request = new CreateSessionRequest(userName, userId, profilePic, connectionId);

        await _userSessionService.CreateSessionAsync(request);

        //Add user to room
            
        var result = await _userSessionService.AddToRoom(connectionId, roomId);

        if (!result.IsSuccess) throw new HubException("Error while adding user session to room");

        await Groups.AddToGroupAsync(connectionId, roomId);

        await Clients.Group(roomId).SendAsync("ReceiveMessage", new { Id = Guid.NewGuid().ToString(), IsNotification = true, Text = $"{userName} has join to the room", });

        await Clients.Group(roomId).SendAsync("NewUserJoined", new BasicUserRoomModel(userId, userName, profilePic));


        //Request to leader to send the actual video state.
        await Clients.User(room.LeaderAccountId).SendAsync("RefreshVideoState");

        //Return the current room state
        return room;
    }

    [Authorize]
    public async Task ChangeVideoRoomFromPlaylistItem(ChangeVideoFromPlaylistItemRequest request)
    {
        await _roomService.ChangeVideoFromPlaylistItemAsync(request);

        await Clients.Group(request.RoomId).SendAsync("OnVideoChangedFromPlaylistItem", request.PlaylistItemId);
    }


    [Authorize]
    public async Task UpdateVideoState(UpdateVideoStateRequest request)
    {
        var connectionId = GetConnectionId();

        var room = await _roomService.GetRoomByIdAsync(request.RoomId);
        if (room is null)
            throw new HubException("Room not found");

        var user = await _userSessionService.GetUserSessionAsync(connectionId);
        if (user is null)
            throw new HubException("User not found");

        if (user.UserId != room.LeaderAccountId)
            throw new HubException("User is not the leader account");

        var result = await _roomService.UpdateVideoStateAsync(request);
        if (!result.IsSuccess)
            throw new HubException("Error while updating video state");

        await Clients.Group(request.RoomId).SendAsync("RoomVideoStateUpdated",request.CurrentTimestamp,request.SentAt,request.IsPaused);
    }

    [Authorize]
    public async Task<IEnumerable<BasicUserRoomModel>> GetUsersFromRoom(string roomId)
    {
        var sessions = await _userSessionService.GetUsersFromRoomAsync(roomId);

        return sessions.Select(x => new BasicUserRoomModel(x.UserId, x.UserName, x.ProfilePicName));;
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var connectionId = GetConnectionId();

        var session = await _userSessionService.GetUserSessionAsync(connectionId);

        if (session != null)
        {
            await Clients.Group(session.RoomId).SendAsync("ReceiveMessage", new { Id = Guid.NewGuid().ToString(), IsNotification = true, Text = $"{session.UserName} has left the room", });
                    
            await _userSessionService.EndSessionAsync(connectionId);
        }
        

        await base.OnDisconnectedAsync(exception);
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
