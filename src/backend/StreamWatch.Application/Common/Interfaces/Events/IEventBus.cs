namespace StreamWatch.Application.Common.Interfaces.Events;

public interface IEventBus
{
    void Register<TEvent>(IEventHandler<TEvent> handler)
        where TEvent : IEvent;

    Task PublishAsync<TEvent>(
        TEvent integrationEvent,
        CancellationToken cancellationToken = default)
        where TEvent : class, IEvent;

    Task StartConsumingAsync(CancellationToken cancellationToken = default);
}