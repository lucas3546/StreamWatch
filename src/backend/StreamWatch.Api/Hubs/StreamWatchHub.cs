using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using StreamWatch.Api.Infraestructure;
using StreamWatch.Api.Infraestructure.Models;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Constants;
using StreamWatch.Core.Enums;

namespace StreamWatch.Api.Hubs;

public class StreamWatchHub : Hub
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserSessionService _userSessionService;
    private readonly IRoomService _roomService;
    

    public StreamWatchHub(IUserSessionService userSessionService, IRoomService roomService, ICurrentUserService currentUserService)
    {
        _userSessionService = userSessionService;
        _roomService = roomService;
        _currentUserService = currentUserService;
    }

    public override Task OnConnectedAsync()
    {
        var role = _currentUserService.Role;
        if(role == Roles.Mod || role == Roles.Admin)
        {
            Groups.AddToGroupAsync(Context.ConnectionId, "Moderation");
        }

        return base.OnConnectedAsync();
    }
        
    public async Task JoinRoomCreatedCategoryGroup(string category)
    {
        if (!Enum.TryParse<RoomCategory>(category, ignoreCase: true, out var parsed))
            throw new HubException("Invalid category");

        var normalized = parsed.ToString();

        await Groups.AddToGroupAsync(Context.ConnectionId, $"RoomCreated:{normalized}");
    }

    public async Task LeaveRoomCreatedCategoryGroup(string category)
    {
        if (!Enum.TryParse<RoomCategory>(category, ignoreCase: true, out var parsed))
            throw new HubException("Invalid category");

        var normalized = parsed.ToString();

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"RoomCreated:{normalized}");
    }
        
    [Authorize]
    public async Task<RoomCache> ConnectToRoom(string roomId)
    {
        var currentUser = GetCurrentUser();

        if(!Ulid.TryParse(roomId, out _)) throw new HubException("Invalid roomId");

        var room = await _roomService.GetRoomByIdAsync(roomId);

        if (room is null) throw new HubException("Room not found");

        //Get if user has a current session in the room
        var session = await _userSessionService.GetUserSessionInRoomAsync(roomId, currentUser.Id);

        if (session is not null) throw new HubException("USER_ALREADY_IN_ROOM");

        //Create user session
        var result = await _userSessionService.CreateSessionAsync(new CreateSessionRequest(currentUser.UserName, currentUser.Id, currentUser.ProfilePic, roomId, currentUser.ConnectionId));

        if(!result.IsSuccess) throw new HubException(result.Error?.Message);

        await Groups.AddToGroupAsync(currentUser.ConnectionId, roomId);

        await Clients.Group(roomId).SendAsync("ReceiveMessage", new RoomMessageModel(isNotification: true, $"{currentUser.UserName} has join to the room"));

        //Make current user leader 
        if(room.CreatedByAccountId == currentUser.Id || room.UsersCount == 0)
        {
            room = await _roomService.ChangeRoomLeader(currentUser.Id, room);

            await Clients.Group(roomId).SendAsync("NewLeader", currentUser.Id);
        }

        room = await _roomService.IncrementUserCount(room);

        //Request to leader to send the actual video state.
        var leaderSession = await _userSessionService.GetUserSessionInRoomAsync(room.LeaderAccountId, room.Id.ToString());

        if(leaderSession != null)
        {
            await Clients.User(leaderSession.ConnectionId).SendAsync("RefreshVideoState");
        }

        //Return the current room state
        return room;
    }

    [Authorize]
    public async Task ChangeVideoRoomFromPlaylistItem(ChangeVideoFromPlaylistItemRequest request)
    {
        request.ValidateModel();

        var result = await _roomService.ChangeVideoFromPlaylistItemAsync(request);

        if (!result.IsSuccess)
        {
            throw new HubException(result.Error?.Message);
        }
        
        await Clients.Group(request.RoomId).SendAsync("OnVideoChangedFromPlaylistItem", request.PlaylistItemId);
    }


    [Authorize]
    public async Task RequestCurrentTimestampToOwner(string roomId)
    {
        if(!Ulid.TryParse(roomId, out _)) throw new HubException("Invalid roomId");

        var room = await _roomService.GetRoomByIdAsync(roomId);

        if(room is null) throw new HubException("NO_ROOM_FOUND");

        await Clients.User(room.LeaderAccountId).SendAsync("RefreshVideoState");
    }


    [Authorize]
    public async Task UpdateVideoState(UpdateVideoStateRequest request)
    {
        request.ValidateModel();

        var result = await _roomService.UpdateVideoStateAsync(request);

        if (!result.IsSuccess) throw new HubException("Error while updating video state");

        await Clients.Group(request.RoomId).SendAsync("RoomVideoStateUpdated",request.CurrentTimestamp,request.SentAt,request.IsPaused);
    }

    [Authorize]
    public async Task<IEnumerable<BasicUserRoomModel>> GetUsersFromRoom(string roomId)
    {
        if(!Ulid.TryParse(roomId, out _)) throw new HubException("Invalid roomId");

        var sessions = await _userSessionService.GetUsersFromRoomAsync(roomId);

        return sessions.Select(x => new BasicUserRoomModel(x.UserId, x.UserName, x.ProfilePicName));;
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var connectionId = GetConnectionId();

        var session = await _userSessionService.GetUserSessionAsync(connectionId);

        if (session != null)
        {
            await _userSessionService.RemoveSessionAsync(connectionId);    

            await Clients.Group(session.RoomId).SendAsync("ReceiveMessage", new RoomMessageModel(isNotification: true, $"{session.UserName} has left the the room"));

            await Clients.Group(session.RoomId).SendAsync("UserLeftRoom", session.UserId);


            var room = await _roomService.GetRoomByIdAsync(session.RoomId);

            if(room is null) return;

            await _roomService.DecreaseUserCount(room);

            if(session.UserId == room.LeaderAccountId)
            {
                var oldestUser = await _userSessionService.GetOldestUserSessionFromRoomAsync(session.RoomId);
                
                if(oldestUser is null) return;

                await _roomService.ChangeRoomLeader(oldestUser.UserId, room);

                await Clients.Group(session.RoomId).SendAsync("NewLeader", oldestUser.UserId);

                await Clients.Group(session.RoomId).SendAsync("ReceiveMessage", new RoomMessageModel(isNotification: true, $"{oldestUser.UserName} is the new leader"));

            }

        }
        

        await base.OnDisconnectedAsync(exception);
    }


    private HubUserContext GetCurrentUser()
    {
        return new HubUserContext(
            GetUserId(),
            GetUsername(),
            GetProfilePic(),
            Context.ConnectionId
        );
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

    private string? GetRole()
    {
        return Context?.User?.FindFirst(ClaimTypes.Role)?.Value;
    }

    private string? GetProfilePic()
    {
        return Context.User?.FindFirst(JwtRegisteredClaimNames.Picture)?.Value;
    }
}
