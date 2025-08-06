using System.ComponentModel.DataAnnotations;

namespace StreamWatch.Application.Requests;

public class GetPagedFriendsRequest
{
    [Range(0, 500)]
    public required int PageNumber {get;set;}
    public required int PageSize {get;set;}
}