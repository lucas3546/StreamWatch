using StreamWatch.Application.Common.Models;

namespace StreamWatch.Application.Common.Interfaces;

public interface IFriendshipService
{
    Task<Result> SendInvitationAsync(string userName);
}