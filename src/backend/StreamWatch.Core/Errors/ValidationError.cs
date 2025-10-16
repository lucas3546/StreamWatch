namespace StreamWatch.Core.Errors;

public class ValidationError : BaseError
{
    public ValidationError(string message) : base(message) { }
    public ValidationError(string key, string message) : base(key, message) { }
}