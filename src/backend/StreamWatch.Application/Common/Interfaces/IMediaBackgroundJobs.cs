namespace StreamWatch.Application.Common.Interfaces;

public interface IMediaBackgroundJobs
{
    Task RemoveMediaAndFile(string fileName, string accountId);
    Task WaitForFileAndCreateMedia(string fileName, string accountId, DateTime expiracy);
}