using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Models;
using StreamWatch.Core.Constants;
using StreamWatch.Core.Entities;
using StreamWatch.Core.Identity;

namespace StreamWatch.Infraestructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<Account> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public IdentityService(UserManager<Account> userManager, RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task<(IEnumerable<string> errors, Account? account)> RegisterAsync(string email, string username, string password, string refreshToken)
    {
        var account = new Account { UserName = username, Email = email, RefreshToken = refreshToken };

        var result = await _userManager.CreateAsync(account, password);

        //Refactor this later
        if (!await _roleManager.RoleExistsAsync(Roles.User))
        {
            await _roleManager.CreateAsync(new IdentityRole(Roles.User));
        }

        await _userManager.AddToRoleAsync(account, Roles.User);

        return (result.Errors.Select(x => x.Code), account);
    }

    public async Task<bool> UpdateUserAsync(Account account)
    {
        var result = await _userManager.UpdateAsync(account);

        return result.Succeeded;
    }

    public async Task<(IEnumerable<string> errors, bool IsSuccess)> UpdateUsernameAsync(string currentUsername, string newUsername)
    {
        var user = await _userManager.FindByNameAsync(currentUsername);
        if (user is null) return (["UserNotFound"], false);

        var result = await _userManager.SetUserNameAsync(user, newUsername);

        return (result.Errors.Select(x => x.Code), result.Succeeded);
    }

    public async Task<(IEnumerable<string> errors, bool IsSuccess)> ChangePasswordAsync(Account account, string currentPassword, string newPassword)
    {
        var result =  await _userManager.ChangePasswordAsync(account, currentPassword, newPassword);
        
        return (result.Errors.Select(x => x.Code), result.Succeeded);
    }

    public async Task<int> CountAccountsAsync() => await _userManager.Users.CountAsync();


    public async Task<Account?> FindUserByEmailAsync(string email)
    {
        var user = await _userManager.Users.Include(o => o.ProfilePic).FirstOrDefaultAsync(x => x.Email == email);

        return user;
    }

    public async Task<Account?> FindUserByUserNameAsync(string userName)
    {
        var user = await _userManager.Users.Include(o => o.ProfilePic).FirstOrDefaultAsync(x => x.UserName == userName);

        return user;
    }

    public async Task<Account?> FindUserByUserByIdAsync(string userId)
    {
        var user = await _userManager.Users.Include(o => o.ProfilePic).FirstOrDefaultAsync(x => x.Id == userId);

        return user;
    }

    public async Task<string?> GetRoleFromUserAsync(Account account)
    {
        var roles = await _userManager.GetRolesAsync(account);

        return roles.FirstOrDefault();
    }

    public async Task<bool> VerifyPasswordAsync(Account account, string password)
    {
        return await _userManager.CheckPasswordAsync(account, password);
    }
    
    public async Task<IEnumerable<UserSearchResultModel>> SearchUsersPagedAsync(string username, int pageNumber, int pageSize)
    {
        return await _userManager.Users
            .AsNoTracking()
            .Where(u => u.UserName.Contains(username))
            .Select(u => new UserSearchResultModel(
                u.Id,
                u.UserName,
                u.ProfilePic.ThumbnailFileName
            ))
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize) 
            .ToListAsync();
    }

    

}