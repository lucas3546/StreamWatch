using Microsoft.EntityFrameworkCore;
using Sqids;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
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

    public async Task<Result<string>> AuthenticateAsync(LoginAccountRequest request)
    {
        var user = await _identityService.FindUserByEmailAsync(request.Email);
        if (user is null) return Result<string>.Failure(new NotFoundError(nameof(request.Email), "No registered user has been found with that email address."));

        var profilePic = await _context.Media.FirstOrDefaultAsync(x => x.CreatedBy == user.Id && x.FileName.StartsWith("profile_pic"));

        bool verification = await _identityService.VerifyPasswordAsync(user, request.Password);
        if (!verification) return Result<string>.Failure(new PasswordMismatchError(nameof(request.Password), "The entered password is incorrect for this account."));

        var role = await _identityService.GetRoleFromUserAsync(user);
        if (string.IsNullOrEmpty(role)) throw new ArgumentNullException("An error occurred while trying to log in to your account. Please contact support.");

        var claims = _jwtService.GetClaimsForUser(user, profilePic?.ThumbnailFileName, role);

        var token = _jwtService.GenerateToken(claims, ExpirationTime: DateTime.Now.AddHours(24));

        return Result<string>.Success(token);
    }

    public async Task<Result<string>> RegisterAsync(RegisterAccountRequest request)
    {
        var (errors, account) = await _identityService.RegisterAsync(request.Email, request.Username, request.Password);

        if (account is null) return Result<string>.Failure(new AccountRegistrationError("Some error has ocurred when trying to register."));

        if (errors.Any(x => x.Equals("DuplicateUserName")))
        {
            return Result<string>.Failure(new AccountRegistrationError(nameof(request.Username), "The Username is already in use!"));
        }

        if (errors.Any()) return Result<string>.Failure(new AccountRegistrationError(string.Join(",", errors)));

        var claims = _jwtService.GetClaimsForUser(account, null, Roles.User);

        var token = _jwtService.GenerateToken(claims, ExpirationTime: DateTime.Now.AddHours(24));

        return Result<string>.Success(token);
    }

    public async Task<Result> SetProfilePictureAsync(string mediaId)
    {
        if (_sqids.Decode(mediaId) is [var decodedId] && mediaId == _sqids.Encode(decodedId))
        {
            var currentUserName = _currentUserService.Name;
            if (string.IsNullOrEmpty(currentUserName)) throw new ArgumentNullException("currentUserName cannot be null or empty!");

            var account = await _identityService.FindUserByUserNameAsync(currentUserName);

            if (account is null) return Result.Failure(new NotFoundError("User not found!"));

            account.ProfilePicId = decodedId;

            await _identityService.UpdateUserAsync(account);

            return Result.Success();
        }
        else
        {
            return Result.Failure(new ValidationError("MediaId is invalid"));
        }

    }

    public async Task<PaginatedList<UserSearchResultModel>> SearchUsersPagedAsync(SearchUsersPagedRequest request)
    {
        var users = await _identityService.SearchUsersPagedAsync(request.UserName, request.PageNumber, request.PageSize);

        int count = await _identityService.CountAccountsAsync();

        return new PaginatedList<UserSearchResultModel>(users, request.PageNumber, request.PageSize, count);
    }
}