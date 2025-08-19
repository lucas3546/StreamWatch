namespace StreamWatch.Application.Common.Interfaces;

public interface IMediaBackgroundJobs
{
    Task WaitForFileAndCreateMedia(string fileName, string accountId, DateTime expiracy);
}