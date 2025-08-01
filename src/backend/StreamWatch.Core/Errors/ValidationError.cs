namespace StreamWatch.Core.Errors;

public class ValidationError : BaseError
{
    public ValidationError(string message) : base(message) { }
}