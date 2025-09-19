using System;

namespace StreamWatch.Application.Common.Models;

public record NotificationModel(int Id, string FromUserName, string Type, string? Payload, DateTimeOffset SentAt);

