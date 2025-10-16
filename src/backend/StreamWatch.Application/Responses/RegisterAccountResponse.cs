using System;

namespace StreamWatch.Application.Responses;

public record RegisterAccountResponse(string token, string refreshToken);
