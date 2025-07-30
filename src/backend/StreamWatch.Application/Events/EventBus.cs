using StreamWatch.Application.Common.Interfaces.Events;

namespace StreamWatch.Application.Events;

internal sealed class EventBus(InMemoryMessageQueue _queue) : IEventBus
{
    private readonly Dictionary<Type, List<Func<IEvent, CancellationToken, Task>>> _handlers = new();
    
    public void Register<TEvent>(IEventHandler<TEvent> handler)
        where TEvent : IEvent
    {
        var eventType = typeof(TEvent);

        if (!_handlers.TryGetValue(eventType, out var handlerList))
        {
            handlerList = new();
            _handlers[eventType] = handlerList;
        }

        handlerList.Add((evt, token) => handler.HandleAsync((TEvent)evt, token));
    }
    
    public async Task PublishAsync<TEvent>(
        TEvent integrationEvent,
        CancellationToken cancellationToken = default)
        where TEvent : class, IEvent
    {
        await _queue.Writer.WriteAsync(integrationEvent, cancellationToken);
    }

    public async Task StartConsumingAsync(CancellationToken cancellationToken = default)
    {
        await foreach (var integrationEvent in _queue.Reader.ReadAllAsync(cancellationToken))
        {
            if (!_handlers.TryGetValue(integrationEvent.GetType(), out var handlers))
            {
                continue;
            }
            foreach (var handler in handlers)
            {
                await handler(integrationEvent, cancellationToken);
            }
        }
    }
}