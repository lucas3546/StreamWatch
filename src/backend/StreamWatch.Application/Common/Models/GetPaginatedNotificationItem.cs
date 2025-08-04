namespace StreamWatch.Application.Common.Models;

public record GetPaginatedNotificationItem(int id, bool isRead, string notificationType, DateTimeOffset createdAt);
