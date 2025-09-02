using Microsoft.Extensions.Hosting;
using Redis.OM;
using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Services;

public class IndexCreationService : IHostedService
{
    private readonly RedisConnectionProvider _provider;
    public IndexCreationService(RedisConnectionProvider provider)
    {
        _provider = provider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        //Drop
        await _provider.Connection.DropIndexAsync(typeof(RoomCache));
        await _provider.Connection.DropIndexAsync(typeof(UserSessionCache));
        //Creation
        await _provider.Connection.CreateIndexAsync(typeof(RoomCache));
        await _provider.Connection.CreateIndexAsync(typeof(UserSessionCache));

    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}