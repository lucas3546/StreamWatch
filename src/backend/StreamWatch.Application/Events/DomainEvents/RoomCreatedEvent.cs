using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Core.Cache;

namespace StreamWatch.Application.Events.DomainEvents
{
    public record RoomCreatedEvent(RoomCache Room) : IEvent
    {
        
    }

}