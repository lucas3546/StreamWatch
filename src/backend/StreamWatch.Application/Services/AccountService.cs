using Microsoft.EntityFrameworkCore;
using Sqids;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Constants;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;
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
    private readonly IBackgroundService _backgroundService;
    private readonly SqidsEncoder<int> _sqids;


    public AccountService(IIdentityService identityService, IJwtService jwtService, IStorageService storageService, IApplicationDbContext context, ICurrentUserService currentUserService, IMediaProcessingService mediaProcessingService, IBackgroundService backgroundService, SqidsEncoder<int> squids)
    {
        _identityService = identityService;
        _jwtService = jwtService;
        _storageService = storageService;
        _context = context;
        _currentUserService = currentUserService;
        _mediaProcessingService = mediaProcessingService;
        _backgroundService = backgroundService;
        _sqids = squids;
    }

    public async Task<Result<AuthenticateAccountResponse>> AuthenticateAsync(LoginAccountRequest request)
    {
        var user = await _identityService.FindUserByEmailAsync(request.Email);
        if (user is null) return Result<AuthenticateAccountResponse>.Failure(new NotFoundError(nameof(request.Email), "No registered user has been found with that email address."));

        bool verification = await _identityService.VerifyPasswordAsync(user, request.Password);
        if (!verification) return Result<AuthenticateAccountResponse>.Failure(new PasswordMismatchError(nameof(request.Password), "The entered password is incorrect for this account."));

        var role = await _identityService.GetRoleFromUserAsync(user);
        if (string.IsNullOrEmpty(role)) throw new ArgumentNullException("An error occurred while trying to log in to your account. Please contact support.");

        user.RefreshToken = Guid.NewGuid().ToString();

        await _identityService.UpdateUserAsync(user);

        string? profilePicThumbnailUrl = null;
        if (user.ProfilePic?.ThumbnailFileName != null)
        {
            profilePicThumbnailUrl = _storageService.GetPublicUrl(user.ProfilePic.ThumbnailFileName);
        }

        var claims = _jwtService.GetClaimsForUser(user, profilePicThumbnailUrl, role);

        var token = _jwtService.GenerateToken(claims, ExpirationTime: DateTime.Now.AddHours(24));

        return Result<AuthenticateAccountResponse>.Success(new AuthenticateAccountResponse(token, user.RefreshToken));
    }

    public async Task<Result<RefreshTokenResponse>> RefreshToken(string refreshToken)
    {
        var currentUserId = _currentUserService.Id;

        if (string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException(nameof(currentUserId), "currentUserId cannot be null or empty!");

        var user = await _identityService.FindUserByUserByIdAsync(currentUserId);

        if (user is null) return Result<RefreshTokenResponse>.Failure(new NotFoundError("User not found!"));
        
        var role = await _identityService.GetRoleFromUserAsync(user);

        if (string.IsNullOrEmpty(role)) throw new ArgumentNullException("An error occurred while trying to log in to your account. Please contact support.");

        user.RefreshToken = Guid.NewGuid().ToString();

        await _identityService.UpdateUserAsync(user);

        string? profilePicThumbnailUrl = null;
        if (user.ProfilePic?.ThumbnailFileName != null)
        {
            profilePicThumbnailUrl = _storageService.GetPublicUrl(user.ProfilePic.ThumbnailFileName);
        }

        var claims = _jwtService.GetClaimsForUser(user, profilePicThumbnailUrl, role);

        var token = _jwtService.GenerateToken(claims, ExpirationTime: DateTime.Now.AddHours(24));

        return Result<RefreshTokenResponse>.Success(new RefreshTokenResponse(token, refreshToken));
    }

    public async Task<Result<RegisterAccountResponse>> RegisterAsync(RegisterAccountRequest request)
    {

        string refreshToken = Guid.NewGuid().ToString();

        var (errors, account) = await _identityService.RegisterAsync(request.Email, request.Username, request.Password, refreshToken);

        if (account is null) return Result<RegisterAccountResponse>.Failure(new AccountRegistrationError("Some error has ocurred when trying to register."));

        if (errors.Any()) return Result<RegisterAccountResponse>.Failure(new ValidationError(string.Join(",", errors)));

        var claims = _jwtService.GetClaimsForUser(account, null, Roles.User);

        var token = _jwtService.GenerateToken(claims, ExpirationTime: DateTime.Now.AddHours(24));

        return Result<RegisterAccountResponse>.Success(new RegisterAccountResponse(token, refreshToken));
    }



    public async Task<Result> ChangeUsernameAsync(string newUsername)
    {
        var currentUsername = _currentUserService.Name;
        
        if (string.IsNullOrEmpty(currentUsername)) throw new ArgumentNullException(nameof(currentUsername), "CurrentUserName cannot be null or empty!");

        if(newUsername.Equals(currentUsername)) return Result.Failure(new ValidationError("You already have that username"));

        var result = await _identityService.UpdateUsernameAsync(currentUsername, newUsername);

        if (result.errors.Any()) return Result.Failure(new ValidationError(string.Join(",", result.errors)));

        return Result.Success();
    }

    public async Task<Result> SetProfilePictureAsync(Guid mediaId)
    {
        var currentUserName = _currentUserService.Name;
        if (string.IsNullOrEmpty(currentUserName)) throw new ArgumentNullException("currentUserName cannot be null or empty!");

        var account = await _identityService.FindUserByUserNameAsync(currentUserName);

        if (account is null) return Result.Failure(new NotFoundError("User not found!"));

        account.ProfilePicId = mediaId;

        await _identityService.UpdateUserAsync(account);

        return Result.Success();

    }

    public async Task<Result> ChangePasswordAsync(ChangePasswordRequest request)
    {
        var currentUserId = _currentUserService.Id;

        if (string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException(nameof(currentUserId), "currentUserId cannot be null or empty!");

        var user = await _identityService.FindUserByUserByIdAsync(currentUserId);

        if (user is null) return Result.Failure(new NotFoundError("User not found!"));

        var result = await _identityService.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

        if (result.errors.Any()) return Result.Failure(new ValidationError(string.Join(",", result.errors)));

        return Result.Success();
    }

    public async Task<Result<GetBasicUserProfileDataResponse>> GetBasicUserProfileDataAsync(string userId)
    {
        var user = await _identityService.FindUserByUserByIdAsync(userId);

        if (user is null) return Result<GetBasicUserProfileDataResponse>.Failure(new NotFoundError("User not found!"));

        string? publicUrlProfilePic = user.ProfilePic == null ? null : _storageService.GetPublicUrl(user.ProfilePic.ThumbnailFileName);
    
    
        var response = new GetBasicUserProfileDataResponse(user.Id, user.UserName, publicUrlProfilePic);

        return Result<GetBasicUserProfileDataResponse>.Success(response);
    }

    public async Task<PaginatedList<UserSearchResultModel>> SearchUsersPagedAsync(SearchUsersPagedRequest request)
    {
        ArgumentNullException.ThrowIfNullOrEmpty(_currentUserService.Id);

        var users = await _identityService.SearchUsersPagedAsync(request.UserName, request.PageNumber, request.PageSize);

        int count = await _identityService.CountAccountsAsync();

        foreach (var user in users)
        {
            user.ProfilePicThumb = user.ProfilePicThumb != null ? _storageService.GetPublicUrl(user.ProfilePicThumb) : null;
        }

        var filtered = users.Where(u => u.Id != _currentUserService.Id).ToList();

        return new PaginatedList<UserSearchResultModel>(filtered, request.PageNumber, request.PageSize, count);
    }
}