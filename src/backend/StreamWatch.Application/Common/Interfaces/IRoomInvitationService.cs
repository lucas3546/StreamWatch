using System;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;

namespace StreamWatch.Application.Common.Interfaces;

public interface IRoomInvitationService
{
    Task<Result> InviteToRoomAsync(InviteToRoomRequest request);
}
