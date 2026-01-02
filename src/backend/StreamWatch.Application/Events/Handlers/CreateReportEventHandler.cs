using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;

namespace StreamWatch.Application.Events.Handlers
{
    public class CreateReportEventHandler : IEventHandler<CreateReportEvent>
    {
        private readonly IRealtimeMessengerService _realtimeMessengerService;
        public CreateReportEventHandler(IRealtimeMessengerService realtimeMessengerService)
        {
            _realtimeMessengerService = realtimeMessengerService;
        }
        public async Task HandleAsync(CreateReportEvent @event, CancellationToken cancellationToken = default)
        {
            var reportNotification = new ReportNotificationModel(
            @event.report.Id,
            @event.report.Details,
            @event.report.TargetId,
            @event.report.TargetType.ToString(),
            @event.report.Category.ToString(),
            @event.report.State.ToString(),
            @event.report.CreatedAt);

            await _realtimeMessengerService.SendToGroupAsync("Moderation", "ReceiveReport", reportNotification);            
        }
    }
}