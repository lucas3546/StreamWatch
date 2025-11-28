using System;

namespace StreamWatch.Application.Common.Models;

public record NotificationModel(int Id, string FromUserName, string fromUserId, string? pictureUrl,string Type, string? Payload, DateTimeOffset SentAt);

