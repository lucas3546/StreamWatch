namespace StreamWatch.Core.Errors;

public abstract class BaseError
{
    public string Message { get; }
    //Base error
    protected BaseError(string message)
    {
        Message = message;
    }

    public override string ToString() => Message;
}