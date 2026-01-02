using System;
using System.ComponentModel.DataAnnotations;

namespace StreamWatch.Application.Requests;

public record SearchUsersPagedRequest
{
    [Length(1, 40)]
    public required string UserName { get; init; }
    [Range(1, 100)]
    public required int PageNumber { get; init; }
    [Range(1, 100)]
    public required int PageSize { get; init; }
}
