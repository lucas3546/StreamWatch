using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
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

        var userId = GetUserId();

        var user = await _userSessionService.GetUserSessionAsync(connectionId);

        

        if (!string.IsNullOrEmpty(user.RoomId))
        {
            if (
                userId != null
                && !await _userSessionService.UserHasOtherSessionsInRoomAsync(userId, user.RoomId)
            )
            {
                await Clients
                    .Group(user.RoomId)
                    .SendAsync(
                        "ReceiveMessage",
                        new
                        {
                            Id = Guid.NewGuid().ToString(),
                            IsNotification = true,
                            Text = $"{user.UserName} has left the room",
                        }
                    );
            }
        }

        await _userSessionService.EndSessionAsync(connectionId);

        await base.OnDisconnectedAsync(exception);
    }

    [Authorize]
    public async Task<RoomCache> ConnectToRoom(string roomId)
    {
        var connectionId = GetConnectionId();
        if (string.IsNullOrEmpty(roomId))
            throw new HubException("No connection id found");

        var userName = GetUsername();

        var userId = GetUserId();

        var room = await _roomService.GetRoomByIdAsync(roomId);

        if (room is null)
            throw new HubException("Room not found");

        var result = await _userSessionService.AddToRoom(connectionId, roomId);

        if (!result.IsSuccess)
            throw new HubException("Error while adding user session to room");

        await Groups.AddToGroupAsync(connectionId, roomId);

        if (
            userId != null
            && !await _userSessionService.UserHasOtherSessionsInRoomAsync(userId, roomId)
        )
        {
            await Clients
                .Group(roomId)
                .SendAsync(
                    "ReceiveMessage",
                    new
                    {
                        Id = Guid.NewGuid().ToString(),
                        IsNotification = true,
                        Text = $"{userName} has joined to room",
                    }
                );
        }

        return room;
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

        await Clients
            .Group(request.RoomId)
            .SendAsync(
                "RoomVideoStateUpdated",
                request.CurrentTimestamp,
                request.SentAt,
                request.IsPaused
            );
    }

    [Authorize]
    public async Task<IEnumerable<BasicUserRoomModel>> GetUsersFromRoom(string roomId)
    {
        var sessions = await _userSessionService.GetUserSessionsAsync(roomId);

        return sessions.Select(x => new BasicUserRoomModel(x.UserId, x.UserName, x.ProfilePicName));;
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
