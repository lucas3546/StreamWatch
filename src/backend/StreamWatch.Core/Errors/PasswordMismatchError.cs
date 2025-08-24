namespace StreamWatch.Core.Errors;

public class PasswordMismatchError : BaseError
{
    public PasswordMismatchError(string key, string message) : base(key, message) { }
}