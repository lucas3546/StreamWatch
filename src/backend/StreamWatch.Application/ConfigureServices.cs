using Microsoft.Extensions.DependencyInjection;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Common.Interfaces.Events;
using StreamWatch.Application.Events;
using StreamWatch.Application.Events.DomainEvents;
using StreamWatch.Application.Events.Handlers;
using StreamWatch.Application.Services;

namespace StreamWatch.Application;

public static class ConfigureServices
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {

        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IFriendshipService, FriendshipService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IAccountStorageService, AccountStorageService>();
        
        
        #region EventsRegion

        services.AddSingleton<IEventBus, InMemoryEventBus>();
        services.AddScoped<IEventHandler<FriendshipCreatedEvent>, FriendshipCreatedEventHandler>();

        #endregion
        
        return services;
    }
}