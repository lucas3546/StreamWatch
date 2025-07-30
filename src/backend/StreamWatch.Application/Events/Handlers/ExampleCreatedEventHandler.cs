using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Events.DomainEvents;

namespace StreamWatch.Application.Events.Handlers;

public class ExampleCreatedEventHandler : IEventHandler<ExampleCreatedEvent>
{
    
    /*
     Example usage
     public class ExampleService(IEventBus _eventBus)
       {
         public async Task CreateExample(string ObjId, string ObjName)
         {
             await _eventBus.PublishAsync(new UserCreatedEvent(ObjId, ObjName));
         }
       }
     */
    public void Register(IEventBus eventBus)
    {
        eventBus.Register(this);
    }

    public Task HandleAsync(ExampleCreatedEvent @event, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Event dispatched: {@event.ObjId}");
        return Task.CompletedTask;
    }
}