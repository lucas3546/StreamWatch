using System.Linq.Expressions;

namespace StreamWatch.Application.Common.Interfaces;

public interface IBackgroundService
{
    string Enqueue(Expression<Action> methodCall);
    string Schedule(Expression<Action> methodCall, TimeSpan delay);
    bool Delete(string jobId);
}