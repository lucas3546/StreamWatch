using Microsoft.Extensions.DependencyInjection;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Services;

namespace StreamWatch.Application;

public static class ConfigureServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {

        services.AddScoped<IAccountService, AccountService>();
        
        return services;
    }
}