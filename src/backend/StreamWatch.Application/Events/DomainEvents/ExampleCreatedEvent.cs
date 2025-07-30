using StreamWatch.Application.Common.Interfaces.Events;

namespace StreamWatch.Application.Events.DomainEvents;

public record ExampleCreatedEvent(string ObjId, string ObjName) : IEvent
{

}