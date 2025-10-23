using System;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public record UpdateRoomRequest(string Id, string Title, RoomCategory Category, bool IsPublic);
