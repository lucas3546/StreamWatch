using Microsoft.Extensions.Logging;
using Sqids;
using StreamWatch.Application.Common.Helpers;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Common.Models;
using StreamWatch.Application.Events.DomainEvents;
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
    private readonly ICurrentUserService _user;
    private readonly IRoomRepository _roomRepository;
    private readonly IMediaProcessingService _mediaProcessingService;
    private readonly IStorageService _storageService;
    private readonly ILogger<RoomService> _logger;
    private readonly IEventBus _eventBus;
    private readonly IRealtimeMessengerService _realtimeMessengerService;

    public RoomService(IApplicationDbContext context, ICurrentUserService currentUserService, IRoomRepository roomRepository, SqidsEncoder<int> squids, IMediaProcessingService processingService, IStorageService storageService, ILogger<RoomService> logger, IEventBus eventBus, IRealtimeMessengerService realtimeMessengerService)
    {
        _context = context;
        _user = currentUserService;
        _roomRepository = roomRepository;
        _mediaProcessingService = processingService;
        _storageService = storageService;
        _logger = logger;
        _eventBus = eventBus;
        _realtimeMessengerService = realtimeMessengerService;
    }

    public async Task<Result<CreateRoomResponse>> CreateRoomAsync(CreateRoomRequest request)
    {
        if(request.Category == RoomCategory.All) return Result<CreateRoomResponse>.Failure(new ValidationError("InvalidCategory", "Invalid value for category"));
        
        ArgumentException.ThrowIfNullOrEmpty(_user.Id);

        ArgumentException.ThrowIfNullOrEmpty(_user.Name);

        var room = new RoomCache()
        {
            Title = request.Title,
            Category = request.Category,
            IsPaused = true,
            IsPublic = request.IsPublic,
            LeaderAccountId = _user.Id,
            CreatedByAccountId = _user.Id,
            LastLeaderUpdateTime = 0,
            CurrentVideoTime = 0,
            CreatedAt = DateTime.UtcNow,
            UsersCount = 0,
        };

        string videoTitle = "";
        if (request.Provider == RoomVideoProvider.Local)
        {
            
            if (request.MediaId is null)
            {
                return Result<CreateRoomResponse>.Failure(new ValidationError("MediaId cannon't be null"));
            }

            var media = await _context.Media.FindAsync(request.MediaId);

            if (media is null)
            {
                return Result<CreateRoomResponse>.Failure(new ValidationError("Media not found"));
            }
            room.VideoUrl = _storageService.GetPublicUrl(media.FileName);
            room.ThumbnailUrl = _storageService.GetPublicUrl(media.ThumbnailFileName); ;
            room.VideoProvider = "Local";
            videoTitle = media.FileName;


        }
        else if (request.Provider == RoomVideoProvider.YouTube)
        {

            if (string.IsNullOrEmpty(request.VideoUrl))
            {
                return Result<CreateRoomResponse>.Failure(new ValidationError("VideoUrl can't be null with the selected provider"));
            }

            var platform = VideoUrlHelper.GetPlatform(request.VideoUrl);
            if (platform is null)
            {
                return Result<CreateRoomResponse>.Failure(new ValidationError("Invalid YoutubeUrl"));
            }

            var thumbnailUrl = VideoUrlHelper.GetThumbnailUrl(request.VideoUrl);
            room.VideoUrl = request.VideoUrl;
            room.ThumbnailUrl = thumbnailUrl ?? "";
            room.VideoProvider = "YouTube";
            videoTitle = await VideoUrlHelper.GetVideoTitleAsync(request.VideoUrl) ?? "Unknown";
        }
        else
        {
            throw new Exception();
        }

        var playlistItem = new PlaylistVideoItem(room.VideoUrl, videoTitle, room.ThumbnailUrl, room.VideoProvider.ToString(), _user.Id, _user.Name);

        room.PlaylistVideoItems.Add(playlistItem);

        var roomId = await _roomRepository.SaveAsync(room);

        _logger.LogInformation("Room created successfully: RoomId={RoomId}, UserId={UserId}, Title={Title}", roomId, _user.Id, request.Title);

        var response = new CreateRoomResponse(roomId);

        await _eventBus.PublishAsync(new RoomCreatedEvent(room));

        return Result<CreateRoomResponse>.Success(response);
    }
    
    public async Task<Result> UpdateRoomAsync(UpdateRoomRequest request)
    {
        ArgumentException.ThrowIfNullOrEmpty(_user.Id);


        var room = await _roomRepository.GetByIdAsync(request.Id);

        if (room is null) return Result.Failure(new NotFoundError("Room not found!"));

        if (_user.Id != room.LeaderAccountId) return Result.Failure(new ValidationError("You are not the leader of the room"));

        room.Title = request.Title;
        room.Category = request.Category;
        room.IsPublic = request.IsPublic;

        await _roomRepository.UpdateAsync(room);

        return Result.Success();
    }

    public async Task<Result<PlaylistVideoItem>> AddVideoToPlaylist(AddVideoToPlaylistRequest request)
    {
        ArgumentException.ThrowIfNullOrEmpty(_user.Id);

        ArgumentException.ThrowIfNullOrEmpty(_user.Name);

        var room = await _roomRepository.GetByIdAsync(request.RoomId);
        if (room is null) return Result<PlaylistVideoItem>.Failure(new NotFoundError("Room not found!"));

        var playlistVideoItem = new PlaylistVideoItem();

        if (request.Provider == RoomVideoProvider.Local)
        {
            var media = await _context.Media.FindAsync(request.MediaId);

            if (media is null) return Result<PlaylistVideoItem>.Failure(new NotFoundError("Media not found!"));

            playlistVideoItem.VideoTitle = media.FileName;
            playlistVideoItem.VideoUrl = _storageService.GetPublicUrl(media.FileName);
            playlistVideoItem.ThumbnailUrl = _storageService.GetPublicUrl(media.ThumbnailFileName);
            playlistVideoItem.Provider = "Local";
        }
        else if (request.Provider == RoomVideoProvider.YouTube)
        {
            var platform = VideoUrlHelper.GetPlatform(request.VideoUrl);
            if (platform is null) return Result<PlaylistVideoItem>.Failure(new ValidationError(nameof(request.VideoUrl), "The URL entered is invalid."));

            playlistVideoItem.VideoUrl = request.VideoUrl;
            playlistVideoItem.ThumbnailUrl = VideoUrlHelper.GetThumbnailUrl(request.VideoUrl) ?? "";
            playlistVideoItem.Provider = "YouTube";
            playlistVideoItem.VideoTitle = await VideoUrlHelper.GetVideoTitleAsync(request.VideoUrl) ?? "Unknown";
        }

        playlistVideoItem.AccountId = _user.Id;
        playlistVideoItem.UserName = _user.Name;

        room.PlaylistVideoItems.Add(playlistVideoItem);

        await _roomRepository.UpdateAsync(room);

        return Result<PlaylistVideoItem>.Success(playlistVideoItem);

    }

    public async Task<Result> ChangeVideoFromPlaylistItemAsync(ChangeVideoFromPlaylistItemRequest request)
    {
        var room = await _roomRepository.GetByIdAsync(request.RoomId);
        
        if (room is null) return Result.Failure(new NotFoundError("Room not found!"));

        if(room.LeaderAccountId != _user.Id) return Result.Failure(new ValidationError("You are not the leader of this room"));

        var videoItem = room.PlaylistVideoItems.FirstOrDefault(x => x.Id == request.PlaylistItemId);

        room.VideoUrl = videoItem.VideoUrl;
        room.VideoProvider = videoItem.Provider;
        room.ThumbnailUrl = videoItem.ThumbnailUrl;
        room.CurrentVideoTime = 0;
        room.IsPaused = true;

        await _roomRepository.UpdateAsync(room);

        return Result.Success();
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



    public async Task<RoomCache> ChangeRoomLeader(string userId, RoomCache room)
    {
        room.LeaderAccountId = userId;

        await _roomRepository.UpdateAsync(room);

        return room;
    }

    public async Task<RoomCache> IncrementUserCount(RoomCache room)
    {
        room.UsersCount++;

        await _roomRepository.UpdateAsync(room);
        
        return room;
    }

        public async Task<RoomCache> DecreaseUserCount(RoomCache room)
    {
        room.UsersCount--;

        await _roomRepository.UpdateAsync(room);
        
        return room;
    }

    public async Task<Result> UpdateVideoStateAsync(UpdateVideoStateRequest request)
    {
        var room = await _roomRepository.GetByIdAsync(request.RoomId);
        if (room is null) return Result.Failure(new NotFoundError("Room not found"));

        if(room.LeaderAccountId != _user.Id) return Result.Failure(new ValidationError("You are not the leader of this room"));

        room.CurrentVideoTime = request.CurrentTimestamp;
        room.LastLeaderUpdateTime = request.SentAt;
        room.IsPaused = request.IsPaused;

        await _roomRepository.UpdateAsync(room);

        return Result.Success();
    }

    public async Task SendMessageToChatAsync(SendMessageRequest request, string? imageUrl)
    {
        var (countryCode, countryName) = _user.Country;
        
        var messageModel = new RoomMessageModel(
            isNotification: false, 
            text: request.Message, 
            userName: _user.Name, 
            countryCode: countryCode, 
            countryName: countryName, 
            image: imageUrl, 
            userId: _user.Id,
            replyToMessageId: request.ReplyToMessageId,
            isWhisper: false
        );

        await _realtimeMessengerService.SendToGroupAsync(request.RoomId, "ReceiveMessage", messageModel);
    }

    public async Task SendWhisperToChatAsync(SendMessageRequest request, string? imageUrl, string targetConnectionId)
    {
        var (countryCode, countryName) = _user.Country;
        
        var messageModel = new RoomMessageModel(
            isNotification: false, 
            text: request.Message, 
            userName: _user.Name, 
            countryCode: countryCode, 
            countryName: countryName, 
            image: imageUrl, 
            userId: _user.Id,
            replyToMessageId: request.ReplyToMessageId,
            isWhisper: true
        );

        await _realtimeMessengerService.SendToClientAsync(targetConnectionId, "ReceiveMessage", messageModel);
    }


}