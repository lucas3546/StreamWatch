using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StreamWatch.Application.Common.Interfaces.Events;

namespace StreamWatch.Application.Events;

public class EventBusBackgroundService(IEventBus _eventBus, IServiceProvider _serviceProvider) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var eventHandlers = scope.ServiceProvider.GetServices<IEventHandler>();
        foreach (var eventHandler in eventHandlers)
        {
            eventHandler.Register(_eventBus);
        }
        await _eventBus.StartConsumingAsync(stoppingToken);
    }
}