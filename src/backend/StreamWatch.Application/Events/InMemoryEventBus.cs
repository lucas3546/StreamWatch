using Microsoft.Extensions.DependencyInjection;
using StreamWatch.Application.Common.Interfaces.Events;

namespace StreamWatch.Application.Events;

public class InMemoryEventBus : IEventBus
{
    private readonly IServiceProvider _serviceProvider;

    public InMemoryEventBus(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task PublishAsync<TEvent>(TEvent @event, CancellationToken cancellationToken = default)
        where TEvent : IEvent
    {
        if (@event == null) throw new ArgumentNullException(nameof(@event));

        using var scope = _serviceProvider.CreateScope();
        var handlers = scope.ServiceProvider.GetServices<IEventHandler<TEvent>>().ToList();

        foreach (var handler in handlers)
        {
            await handler.HandleAsync(@event, cancellationToken);
        }
    }
}