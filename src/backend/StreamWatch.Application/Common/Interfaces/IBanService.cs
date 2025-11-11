using System;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Application.Common.Interfaces;

public interface IBanService
{
    Task<Result<string>> BanAsync(BanAccountRequest request);
    Task<Result<GetActiveBanForCurrentUserResponse>> GetActiveBanForCurrentUser();
}
