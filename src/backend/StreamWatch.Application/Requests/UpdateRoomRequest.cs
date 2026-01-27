using System;
using System.ComponentModel.DataAnnotations;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public record UpdateRoomRequest{
    [Length(1, 40)]
    public required string Id {get; init;}
    [Length(4, 40)]
    public required string Title {get; init;}
    public required RoomCategory Category {get; init;}
    public required bool IsPublic {get; init;}
};
