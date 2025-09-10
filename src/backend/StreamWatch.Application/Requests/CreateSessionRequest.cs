namespace StreamWatch.Application.Requests;

public record CreateSessionRequest(string? UserName, string? UserId, string? PictureFilename,string ConnectionId);