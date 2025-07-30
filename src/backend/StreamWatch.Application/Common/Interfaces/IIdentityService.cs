using StreamWatch.Core.Identity;

namespace StreamWatch.Application.Common.Interfaces;

public interface IIdentityService
{
     Task<(IEnumerable<string> errors, Account? account)>  RegisterAsync(string email, string username, string password);
}