using Sqids;
using StreamWatch.Application.Common.Helpers;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Requests;
using StreamWatch.Application.Responses;
using StreamWatch.Core.Cache;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Enums;
using StreamWatch.Core.Errors;

namespace StreamWatch.Application.Services;

public class RoomService : IRoomService
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly IRoomRepository _roomRepository;
    private readonly IMediaProcessingService _mediaProcessingService;
    private readonly IStorageService _storageService;
    private readonly SqidsEncoder<int> _sqids;

    public RoomService(IApplicationDbContext context, ICurrentUserService currentUserService, IRoomRepository roomRepository, SqidsEncoder<int> squids, IMediaProcessingService processingService, IStorageService storageService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _roomRepository = roomRepository;
        _sqids = squids;
        _mediaProcessingService = processingService;
        _storageService = storageService;
    }

    public async Task<Result<CreateRoomResponse>> CreateRoomAsync(CreateRoomRequest request)
    {
        var currentUserId = _currentUserService.Id;
        if (string.IsNullOrEmpty(currentUserId)) throw new ArgumentNullException(nameof(currentUserId), "CurrentUserId cannot be null or empty!");

        var currentUserName = _currentUserService.Name;
        if (string.IsNullOrEmpty(currentUserName)) throw new ArgumentNullException(nameof(currentUserId), "CurrentUserName cannot be null or empty!");

        var room = new RoomCache()
        {
            Title = request.Title,
            Category = request.Category,
            IsPaused = true,
            IsPublic = request.IsPublic,
            LeaderAccountId = currentUserId,
            CreatedByAccountId = currentUserId,
            LastLeaderUpdateTime = 0,
            CurrentVideoTime = 0,
            CreatedAt = DateTime.UtcNow,
            UsersCount = 0,
        };

        string videoTitle = "";
        if (request.Provider == RoomVideoProvider.Local)
        {
            if (_sqids.Decode(request.MediaId) is [var decodedId] && request.MediaId == _sqids.Encode(decodedId))
            {
                var media = await _context.Media.FindAsync(decodedId);

                room.VideoUrl = media.FileName;
                room.ThumbnailUrl = media.ThumbnailFileName;
                room.VideoProvider = "S3";
                videoTitle = media.FileName;
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
            videoTitle = await VideoUrlHelper.GetVideoTitleAsync(request.VideoUrl) ?? "Unknown";
        }

        var playlistItem = new PlaylistVideoItem(room.VideoUrl, videoTitle, room.ThumbnailUrl, room.VideoProvider.ToString(), currentUserId, currentUserName);

        room.PlaylistVideoItems.Add(playlistItem);

        var roomId = await _roomRepository.SaveAsync(room);

        var response = new CreateRoomResponse(roomId);

        return Result<CreateRoomResponse>.Success(response);
    }

    public async Task<RoomCache?> GetRoomByIdAsync(string roomId)
    {
        return await _roomRepository.GetByIdAsync(roomId);
    }

    public async Task<PaginatedList<GetPagedRoomItemResponse>> GetPagedRooms(GetPagedRoomsRequest request)
    {
        var rooms = await _roomRepository.GetPagedAsync(request.PageNumber, request.PageSize, request.Category, request.IncludeNswf, request.OrderBy);

        var totalItems = await _roomRepository.CountAsync();

        var dtos = rooms.Select(x => new GetPagedRoomItemResponse(x.Id.ToString(), x.Title, x.Category.ToString(), x.ThumbnailUrl, x.UsersCount, x.VideoProvider.ToString(), x.CreatedAt));

        var response = new PaginatedList<GetPagedRoomItemResponse>(dtos, request.PageNumber, request.PageSize, totalItems);

        return response;
    }

    public async Task<Result> ChangeRoomLeader(string leaderId, string roomId)
    {
        var room = await _roomRepository.GetByIdAsync(roomId);
        
        if (room is null) return Result.Failure(new NotFoundError("Room not found"));

        room.LeaderAccountId = leaderId;

        await _roomRepository.UpdateAsync(room);

        return Result.Success();
    }

    public async Task<Result> UpdateVideoStateAsync(UpdateVideoStateRequest request)
    {
        var room = await _roomRepository.GetByIdAsync(request.RoomId);
        if (room is null) return Result.Failure(new NotFoundError("Room not found"));

        room.CurrentVideoTime = request.CurrentTimestamp;
        room.LastLeaderUpdateTime = request.SentAt;
        room.IsPaused = request.IsPaused;

        await _roomRepository.UpdateAsync(room);

        return Result.Success();
    }
    
    
    
}