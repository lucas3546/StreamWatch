namespace StreamWatch.Application.Responses;

public record class AuthenticateAccountResponse(string token, string refreshToken);

