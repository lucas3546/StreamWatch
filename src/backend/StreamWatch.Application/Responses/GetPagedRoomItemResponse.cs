namespace StreamWatch.Application.Responses;

public record GetPagedRoomItemResponse(string roomId, string title, string thumbnailUrl, int userCount, string videoProvider, DateTime createdAt);