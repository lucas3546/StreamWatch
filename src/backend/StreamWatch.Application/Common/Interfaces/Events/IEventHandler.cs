namespace StreamWatch.Application.Common.Interfaces.Events;

public interface IEventHandler
{  
    void Register(IEventBus eventBus);
}

public interface IEventHandler<in TEvent> : IEventHandler
    where TEvent : IEvent
{
    Task HandleAsync(TEvent integrationEvent, CancellationToken cancellationToken = default);
}