using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Constants;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class AccountService : IAccountService
{
    private readonly IIdentityService _identityService;
    private readonly IJwtService _jwtService;

    public AccountService(IIdentityService identityService, IJwtService jwtService)
    {
        _identityService = identityService;
        _jwtService = jwtService;
    }
    public async Task<Result<string>> RegisterAsync(RegisterAccountRequest request)
    {
        var (errors, account) = await _identityService.RegisterAsync(request.Email, request.Username, request.Password);

        if (account is null) return Result<string>.Failure(new AccountRegistrationError("Some error has ocurred when trying to register."));
        
        if (errors.Any()) return Result<string>.Failure(new AccountRegistrationError(string.Join(",", errors)));
        
        var claims = _jwtService.GetClaimsForUser(account, Roles.User);
        
        var token = _jwtService.GenerateToken(claims, ExpirationTime: DateTime.Now.AddHours(24));
        
        return Result<string>.Success(token);
    }
}