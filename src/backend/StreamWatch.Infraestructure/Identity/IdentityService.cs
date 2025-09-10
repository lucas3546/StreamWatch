using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Constants;
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

    public async Task<(IEnumerable<string> errors, Account? account)> RegisterAsync(string email, string username, string password)
    {
        var account = new Account { UserName = username, Email = email };
        
        var result = await _userManager.CreateAsync(account, password);
        
        //Refactor this later
        if (!await _roleManager.RoleExistsAsync(Roles.User))
        {
            await _roleManager.CreateAsync(new IdentityRole(Roles.User));
        }
        
        await _userManager.AddToRoleAsync(account, Roles.User);

        return (result.Errors.Select(x => x.Code), account);
    }

    public async Task<Account?> FindUserByEmailAsync(string email)
    {
        var user = _userManager.Users.FirstOrDefault(x => x.Email == email);
        
        return user;
    }
    
    public async Task<Account?> FindUserByUserNameAsync(string userName)
    {
        var user = _userManager.Users.FirstOrDefault(x => x.UserName == userName);
        
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
    

}