namespace StreamWatch.Core.Errors;

public class PasswordMismatchError : BaseError
{
    public PasswordMismatchError(string message) : base(message) { }
}