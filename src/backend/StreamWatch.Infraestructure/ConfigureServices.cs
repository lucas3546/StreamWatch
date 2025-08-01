using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Identity;
using StreamWatch.Infraestructure.Identity;
using StreamWatch.Infraestructure.Persistence;
using StreamWatch.Infraestructure.Persistence.Interceptors;
using StreamWatch.Infraestructure.Persistence.Repositories;
using StreamWatch.Infraestructure.Services;

namespace StreamWatch.Infraestructure;

public static class ConfigureServices
{
    public static IServiceCollection AddInfraestructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        var databaseConnectionString = configuration.GetConnectionString("DefaultConnection");
        if(databaseConnectionString is null) throw new ArgumentNullException(nameof(databaseConnectionString));
        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseNpgsql(databaseConnectionString);
        });
        
        //Configure identity
        services.AddIdentity<Account, IdentityRole>(options => { }).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();
        
        services.Configure<IdentityOptions>(options =>
        {
            options.Lockout.AllowedForNewUsers = false;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.User.RequireUniqueEmail = true;
            
        });
        
        //Other DI
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IFriendshipRepository, FriendshipRepository>();
        services.AddTransient<IIdentityService, IdentityService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddSingleton(TimeProvider.System);
        
        return services;
    }
}