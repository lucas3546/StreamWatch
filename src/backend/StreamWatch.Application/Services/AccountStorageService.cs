using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;

namespace StreamWatch.Application.Services;

public class AccountStorageService : IAccountStorageService
{
    private readonly IApplicationDbContext _context;
    private readonly IStorageService _storageService;
    private readonly IBackgroundService _backgroundService;
    private readonly IMediaBackgroundJobs _mediaBackgroundJobs;
    private readonly ICurrentUserService _currentUserService;

    public AccountStorageService(IStorageService storageService,  IBackgroundService backgroundService, IApplicationDbContext context, IMediaBackgroundJobs mediaBackgroundJobs, ICurrentUserService currentUserService)
    {
        _storageService = storageService;
        _backgroundService = backgroundService;
        _context = context;
        _mediaBackgroundJobs = mediaBackgroundJobs;
        _currentUserService = currentUserService;
    }
    public async Task<Result<GetPresignedUrlResponse>> GetPresignedUrl(GetPresignedUrlRequest request)
    {
        var currentUserId = _currentUserService.Id; 
        if(string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException("CurrentUserId cannot be null or empty!");
        
        var presignedUrlExpiresAt = DateTime.Now.AddMinutes(40);

        var fileNameGuid = Guid.NewGuid() + Path.GetExtension(request.FileName);
        
        var presignedUrl = await _storageService.GetPresignedUrl(fileNameGuid, request.ContentType, presignedUrlExpiresAt);
        
        var headers = new Dictionary<string, string>()
        {
            ["Content-Type"] = request.ContentType
        };
        
        var fileExpiration = DateTime.UtcNow.AddHours(1);

        _backgroundService.Enqueue(() => _mediaBackgroundJobs.WaitForFileAndCreateMedia(fileNameGuid, currentUserId, fileExpiration));
        
        var response = new GetPresignedUrlResponse("Local", presignedUrl, "PUT", headers, presignedUrlExpiresAt);
        
        return Result<GetPresignedUrlResponse>.Success(response);
    }
    
    
    
    
}