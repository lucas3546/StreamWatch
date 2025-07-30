using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;

namespace StreamWatch.Application.Common.Interfaces;

public interface IAccountService
{
    Task<Result<string>> RegisterAsync(RegisterAccountRequest request);
}