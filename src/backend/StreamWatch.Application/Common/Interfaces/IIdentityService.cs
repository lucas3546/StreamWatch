using StreamWatch.Core.Identity;

namespace StreamWatch.Application.Common.Interfaces;

public interface IIdentityService
{
     Task<(IEnumerable<string> errors, Account? account)>  RegisterAsync(string email, string username, string password);
     Task<Account?> FindUserByEmailAsync(string email);
     Task<Account?> FindUserByUserNameAsync(string userName);
     Task<string> GetRoleFromUserAsync(Account account);
     Task<bool> VerifyPasswordAsync(Account account, string password);
}