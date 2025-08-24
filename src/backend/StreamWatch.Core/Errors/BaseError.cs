namespace StreamWatch.Core.Errors;

public abstract class BaseError
{
    public string? Key { get; }
    public string Message { get; }
    //Base error
    protected BaseError(string message)
    {
        Message = message;
    }
    
    protected BaseError(string key, string message)
    {
        Key = key;
        Message = message;
    }

    public override string ToString() => Message;
}