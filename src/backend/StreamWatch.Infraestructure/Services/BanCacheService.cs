using System;
using Redis.OM;
using StackExchange.Redis;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Services;


public class BanCacheService : IBanCacheService
{
    private readonly IDatabase _db;

    public BanCacheService(IConnectionMultiplexer multiplexer)
    {
        _db = multiplexer.GetDatabase();
    }

    public async Task BanAccountIdAsync(string accountId)
    {
        await _db.SetAddAsync("banned:users", accountId);
    }

    public async Task BanIpAsync(string ipAddress)
    {
        await _db.SetAddAsync("banned:ips", ipAddress);
    }

    public async Task OverwriteBannedUsersAsync(IEnumerable<(string accountId, string ipAddress)> accountIds)
    {
        await _db.KeyDeleteAsync("banned:users");
        await _db.KeyDeleteAsync("banned:ips");

        var userValues = accountIds
            .Where(x => !string.IsNullOrWhiteSpace(x.accountId))
            .Select(x => (RedisValue)x.accountId)
            .ToArray();

        var ipValues = accountIds
            .Where(x => !string.IsNullOrWhiteSpace(x.ipAddress))
            .Select(x => (RedisValue)x.ipAddress)
            .ToArray();

        if (userValues.Length == 0 && ipValues.Length == 0)
            return;

        if (userValues.Length > 0) await _db.SetAddAsync("banned:users", userValues);
            

        if (ipValues.Length > 0)  await _db.SetAddAsync("banned:ips", ipValues);
    }

    public async Task<bool> IsAccountBannedAsync(string accountId, string ipAddress)
    {

        if (await _db.SetContainsAsync("banned:users", accountId))
        {
            return true;
        }
        else if(await _db.SetContainsAsync("banned:ips", ipAddress))
        {
            return true;
        }

        return false;
    }

    public async Task<bool> IsIpBannedAsync(string ipAddress)
    {
        return await _db.SetContainsAsync("banned:ips", ipAddress);
    }

    public async Task UnbanAccountIdAsync(string accountId)
    {
        await _db.SetRemoveAsync("banned:users", accountId);
    }

    public async Task UnbanIpAsync(string ipAddress)
    {
        await _db.SetRemoveAsync("banned:ips", ipAddress);
    }

    public async Task<IEnumerable<string>> GetAllBannedAccountsAsync()
    {
        var members = await _db.SetMembersAsync("banned:users");
        return members.Select(x => x.ToString());
    }

    public async Task<IEnumerable<string>> GetAllBannedIpsAsync()
    {
        var members = await _db.SetMembersAsync("banned:ips");
        return members.Select(x => x.ToString());
    }
}
