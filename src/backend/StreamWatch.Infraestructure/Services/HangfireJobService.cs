using System.Linq.Expressions;
using Hangfire;
using StreamWatch.Application.Common.Interfaces;

namespace StreamWatch.Infraestructure.Services;

public class HangfireJobService : IBackgroundService
{
    public string Enqueue(Expression<Action> methodCall)
    {
        return BackgroundJob.Enqueue(methodCall);
    }

    public string Schedule(Expression<Action> methodCall, TimeSpan delay)
    {
        return BackgroundJob.Schedule(methodCall, delay);
    }
}