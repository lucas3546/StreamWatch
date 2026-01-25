using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Identity;

namespace StreamWatch.Application.Common.Interfaces;

public interface IIdentityService
{
     Task<(IEnumerable<string> errors, Account? account)>  RegisterAsync(string email, string username, string password, string refreshToken);
     Task<(IEnumerable<string> errors, bool IsSuccess)> UpdateUsernameAsync(string currentUsername, string newUsername);
     Task<(IEnumerable<string> errors, bool IsSuccess)> ChangePasswordAsync(Account account, string currentPassword, string newPassword);
     Task<bool> UpdateUserAsync(Account account);
     Task<Account?> FindUserByUserByIdAsync(string userId);
     Task<Account?> FindUserByEmailAsync(string email);
     Task<Account?> FindUserByUserNameAsync(string userName);
     Task<IEnumerable<UserSearchResultModel>> SearchUsersPagedAsync(string username, int pageNumber, int pageSize);
     Task<int> CountAccountsAsync();
     Task<string> GetRoleFromUserAsync(Account account);
     Task<bool> VerifyPasswordAsync(Account account, string password);
     Task<bool> DeleteUserAsync(Account account);
}