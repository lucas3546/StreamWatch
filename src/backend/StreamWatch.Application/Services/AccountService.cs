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
    private readonly IMediaProcessingService _mediaProcessingService;

    public AccountService(IIdentityService identityService, IJwtService jwtService, IStorageService storageService, IApplicationDbContext context, ICurrentUserService currentUserService, IMediaProcessingService mediaProcessingService)
    {
        _identityService = identityService;
        _jwtService = jwtService;
        _storageService = storageService;
        _context = context;
        _currentUserService = currentUserService;
        _mediaProcessingService = mediaProcessingService;
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
        
        
        //Process and upload profile pic thumbnail
        string thumbnailFileName =  "thumb_"+ Guid.NewGuid() + ".webp";
        
        Stream thumbnailStream = _mediaProcessingService.ResizeImage(request.Picture.OpenReadStream(), 800, 800);
        
        UploadedFile thumbnailUrl = await _storageService.UploadAsync(thumbnailStream, thumbnailFileName, "image/webp");

        await thumbnailStream.DisposeAsync();
        
        //Process and upload original profile pic
        string profilePicName = Guid.NewGuid() + ".webp";

        Stream profilePicStream = _mediaProcessingService.ConvertImageFormat(request.Picture.OpenReadStream());
        
        UploadedFile profilePic = await _storageService.UploadAsync(profilePicStream, profilePicName, "image/webp");

        await profilePicStream.DisposeAsync();
        
        //Save in database 
        var media = new Media
        {
            FileName = profilePicName,
            ThumbnailFileName = thumbnailFileName,
            Provider = profilePic.Provider,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };
        
        await _context.Media.AddAsync(media);
        
        await _context.SaveChangesAsync(CancellationToken.None);
        
        return Result.Success();
    }
}