using System.ComponentModel.DataAnnotations;
using StreamWatch.Core.Enums;

namespace StreamWatch.Application.Requests;

public record GetPagedRoomsRequest
{
    [Range(1, 500)]
    public required int PageNumber {get;init;}
    
    [Range(1, 30)]
    public required int PageSize {get;init;}
    
    public required RoomCategory Category { get; init; }
    
    public bool IncludeNswf { get; init; }
    
    public required RoomOrderBy OrderBy {get;init;}
}