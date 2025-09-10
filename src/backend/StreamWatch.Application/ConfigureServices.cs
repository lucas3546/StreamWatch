using Microsoft.Extensions.DependencyInjection;
using Sqids;
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
        services.AddScoped<IUserSessionService, UserSessionService>();
        services.AddScoped<IRoomService, RoomService>();
        services.AddSingleton(new SqidsEncoder<int>(new()
        {
            Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            MinLength = 6,
        }));
        #region EventsRegion

        services.AddSingleton<IEventBus, InMemoryEventBus>();
        services.AddScoped<IEventHandler<FriendshipCreatedEvent>, FriendshipCreatedEventHandler>();
        services.AddScoped<IEventHandler<UserJoinedRoomEvent>, UserJoinedRoomEventHandler>();
        services.AddScoped<IEventHandler<UserLeftRoomEvent>, UserLeftRoomEventHandler>();

        #endregion
        
        return services;
    }
}