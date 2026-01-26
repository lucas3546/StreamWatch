namespace StreamWatch.Application.Responses;

public record GetPagedRoomItemResponse(string roomId, string title, string category, string thumbnailUrl, int userCount, string provider, DateTime createdAt, bool isPublic);