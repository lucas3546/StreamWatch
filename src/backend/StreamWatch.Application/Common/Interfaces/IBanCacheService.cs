using System;

namespace StreamWatch.Application.Common.Interfaces;

public interface IBanCacheService
{
    Task BanAccountIdAsync(string accountId);
    Task BanIpAsync(string ipAddress);
    Task OverwriteBannedUsersAsync(IEnumerable<(string accountId, string ipAddress)> accountIds);
    Task<bool> IsAccountBannedAsync(string accountId, string ipAddress);
    Task<bool> IsIpBannedAsync(string ipAddress);
    Task UnbanAccountIdAsync(string accountId);
    Task UnbanIpAsync(string ipAddress);
    Task<IEnumerable<string>> GetAllBannedAccountsAsync();
    Task<IEnumerable<string>> GetAllBannedIpsAsync();
}
