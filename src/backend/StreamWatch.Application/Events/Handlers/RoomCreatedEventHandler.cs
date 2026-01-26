using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Events.Handlers
{
    public class RoomCreatedEventHandler : IEventHandler<RoomCreatedEvent>
    {
        private readonly IRealtimeMessengerService _realtimeMessengerService;
        public RoomCreatedEventHandler(IRealtimeMessengerService realtimeMessengerService)
        {
            _realtimeMessengerService = realtimeMessengerService;
        }
        public async Task HandleAsync(RoomCreatedEvent @event, CancellationToken cancellationToken = default)
        {

            var model = new RoomCreatedNotificationModel(@event.Room.Id.ToString(), @event.Room.ThumbnailUrl, @event.Room.Title, @event.Room.Category.ToString(), @event.Room.VideoProvider, @event.Room.UsersCount, @event.Room.CreatedAt, @event.Room.IsPublic);

            if (model.isPublic)
            {
                await _realtimeMessengerService.SendToGroupAsync($"RoomCreated:{RoomCategory.All}", "ReceiveCreatedRoom", model);

                await _realtimeMessengerService.SendToGroupAsync($"RoomCreated:{@event.Room.Category}", "ReceiveCreatedRoom", model);
            }
        }
    }
}