using System;
using StreamWatch.Application.Common.Models;

namespace StreamWatch.Application.Common.Interfaces;

public interface IStreamWatchHub
{
    Task ReceiveMessage(object message);
    Task ReceiveNotification(NotificationModel notification);
    Task RoomVideoStateUpdated(
        double currentTimestamp,
        DateTime sentAt,
        bool isPaused
    );
}
