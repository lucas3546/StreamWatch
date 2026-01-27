using System.ComponentModel.DataAnnotations;

namespace StreamWatch.Application.Requests;

public class GetPagedFriendsRequest
{
    [Range(1, 500)]
    public required int PageNumber {get;set;}
    [Range(1, 20)]
    public required int PageSize {get;set;}
}