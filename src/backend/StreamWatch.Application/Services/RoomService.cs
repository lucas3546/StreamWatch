using Sqids;
using StreamWatch.Application.Common.Helpers;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class RoomService : IRoomService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRoomRepository _roomRepository;
    private readonly SqidsEncoder<int> _sqids;

    public RoomService(IApplicationDbContext context, ICurrentUserService currentUserService, IRoomRepository roomRepository, SqidsEncoder<int> squids)
    {
        _context = context;
        _currentUserService = currentUserService;
        _roomRepository = roomRepository;
        _sqids = squids;
    }
    
    public async Task<Result<CreateRoomResponse>> CreateRoomAsync(CreateRoomRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException(nameof(currentUserId), "CurrentUserId cannot be null or empty!");

        
        var room = new RoomCache()
        {
            Title = request.Title,
            IsPaused = true,
            IsPublic = request.IsPublic,
            LeaderAccountId = currentUserId,
            LastLeaderUpdateTime = 0,
            CurrentVideoTime = 0,
            CreatedAt = DateTime.UtcNow,
            UsersCount = 0,
        };

        if (request.Provider == RoomVideoProvider.Local)
        {
            if (_sqids.Decode(request.MediaId) is [var decodedId] && request.MediaId == _sqids.Encode(decodedId))
            {
                var media = await _context.Media.FindAsync(decodedId);
            
                room.VideoUrl = media.FileName;
                room.ThumbnailUrl = media.ThumbnailFileName;
                room.VideoProvider = "S3";
            }
            else
            {
                return Result<CreateRoomResponse>.Failure(new ValidationError("MediaId is invalid"));
            }
            
            
        }
        else if (request.Provider == RoomVideoProvider.YouTube)
        {
            var platform = VideoUrlHelper.GetPlatform(request.VideoUrl);
            if (platform is null) throw new Exception();

            var thumbnailUrl = VideoUrlHelper.GetThumbnailUrl(request.VideoUrl);
            
            room.VideoUrl = request.VideoUrl;
            room.ThumbnailUrl = thumbnailUrl;
            room.VideoProvider = "YouTube";
        }

        var roomId = await _roomRepository.SaveAsync(room);

        var response = new CreateRoomResponse(roomId);
        
        return Result<CreateRoomResponse>.Success(response);
    }
}