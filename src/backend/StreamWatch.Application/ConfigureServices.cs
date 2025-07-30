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

        #region EventsRegion
        //Reference:
        //https://medium.com/@metoz.florian/breaking-free-nets-hidden-gem-vs-mediatr-a-step-by-step-guide-583c5d09baf2
        //https://freedium.cfd/https://medium.com/@metoz.florian/breaking-free-nets-hidden-gem-vs-mediatr-a-step-by-step-guide-583c5d09baf2
        // Register dependencies in DI container
        services.AddSingleton<InMemoryMessageQueue>();
        services.AddSingleton<IEventBus, EventBus>();

        // Register all handlers
        services.AddScoped<IEventHandler<ExampleCreatedEvent>, ExampleCreatedEventHandler>(); 

        // Register a hosted service to consume events in the background
        services.AddHostedService<EventBusBackgroundService>();

        #endregion
        
        return services;
    }
}