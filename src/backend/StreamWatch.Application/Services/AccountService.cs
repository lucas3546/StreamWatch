using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Core.Constants;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class AccountService : IAccountService
{
    private readonly IIdentityService _identityService;
    private readonly IJwtService _jwtService;
    private readonly IStorageService _storageService;
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AccountService(IIdentityService identityService, IJwtService jwtService, IStorageService storageService, IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _identityService = identityService;
        _jwtService = jwtService;
        _storageService = storageService;
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<string>> AuthenticateAsync(LoginAccountRequest request)
    {
        var user = await _identityService.FindUserByEmailAsync(request.Email);
        if (user is null) return Result<string>.Failure(new NotFoundError("UserNotFound"));
        
        bool verification = await _identityService.VerifyPasswordAsync(user, request.Password);
        if (!verification) return Result<string>.Failure(new PasswordMismatchError("PasswordMismatch"));

        var role = await _identityService.GetRoleFromUserAsync(user);
        if(string.IsNullOrEmpty(role)) throw new ArgumentNullException("An error occurred while trying to log in to your account. Please contact support.");

        var claims =  _jwtService.GetClaimsForUser(user, role);

        var token = _jwtService.GenerateToken(claims, ExpirationTime: DateTime.Now.AddHours(24));
        
        return Result<string>.Success(token);
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

    public async Task<Result> SetProfilePictureAsync(UpdateProfilePicRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        string profilePicName = Guid.NewGuid() + Path.GetExtension(request.Picture.FileName);
        
        var fileUrl = await _storageService.UploadAsync(request.Picture.OpenReadStream(), profilePicName, request.Picture.ContentType);

        var media = new Media
        {
            FileName = profilePicName,
            ThumbnailUrl = "",
            SourceUrl = fileUrl,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };
        
        await _context.Media.AddAsync(media);
        
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return Result.Success();
    }
}