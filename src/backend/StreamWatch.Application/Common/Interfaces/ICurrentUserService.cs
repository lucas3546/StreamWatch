namespace StreamWatch.Application.Common.Interfaces;

public interface ICurrentUserService
{
    string? Id { get; }
    string? Name { get; }
}