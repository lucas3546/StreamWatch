namespace StreamWatch.Application.Common.Interfaces;

public interface ICurrentUserService
{
    string? Id { get; }
    string? Name { get; }
    (string? isoCode, string? name) Country { get; }
    string? Role { get; }
}