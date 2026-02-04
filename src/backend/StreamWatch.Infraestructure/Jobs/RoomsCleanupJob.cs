using System;
using Amazon.Runtime.Internal.Util;
using Microsoft.Extensions.Logging;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Jobs;

public class RoomsCleanupJob
{
    private readonly IRoomRepository _roomRepository;
    private readonly ILogger<RoomsCleanupJob> _logger;

    public RoomsCleanupJob(IRoomRepository repo, ILogger<RoomsCleanupJob> logger)
    {
        _roomRepository = repo;
        _logger = logger;
    }

public async Task RemoveEmptyRooms()
{
    _logger.LogInformation("Starting empty rooms cleanup");

    var rooms = (await _roomRepository.GetEmptyRooms()).ToList();

    if (!rooms.Any())
        return;


    var roomsToRemove = rooms
    .Where(x =>
        !x.IsPermanent &&
        x.EmptySince.HasValue &&
        DateTimeOffset.UtcNow - x.EmptySince.Value >= TimeSpan.FromMinutes(5))
    .ToList();


    if (!roomsToRemove.Any())
        return;

    await _roomRepository.DeleteAsync(roomsToRemove);

    _logger.LogInformation(
        "Rooms cleanup completed, Rooms={RoomsCount} deleted",
        roomsToRemove.Count
    );
}

}