using System.Security.Claims;
using StreamWatch.Core.Identity;

namespace StreamWatch.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateToken(List<Claim> claimsForToken, DateTime ExpirationTime);
    List<Claim> GetClaimsForUser(Account account, string? profilePicName, string roleName);
}