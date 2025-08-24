namespace StreamWatch.Core.Errors;

public class AccountRegistrationError : BaseError
{
    public AccountRegistrationError(string message) : base(message)
    {
        
    }
    
    public AccountRegistrationError(string key, string message) : base(key, message)
    {
        
    }
    
}