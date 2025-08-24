namespace StreamWatch.Core.Errors;

public class NotFoundError : BaseError
{
    public NotFoundError(string message) : base(message) { }
    public NotFoundError(string key, string message) : base(key, message) { }
}