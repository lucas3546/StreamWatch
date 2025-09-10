using Amazon.Runtime;
using Amazon.S3;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Redis.OM;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Application.Services;
using StreamWatch.Core.Identity;
using StreamWatch.Core.Options;
using StreamWatch.Infraestructure.Identity;
using StreamWatch.Infraestructure.Persistence;
using StreamWatch.Infraestructure.Persistence.Interceptors;
using StreamWatch.Infraestructure.Repositories;
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
        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
        
        
        //Redis Stack
        var redisConnectionString = configuration.GetConnectionString("RedisConnection");

        if(string.IsNullOrEmpty(redisConnectionString)) throw new ArgumentNullException(nameof(redisConnectionString));

        services.AddHostedService<IndexCreationService>();

        services.AddSingleton(new RedisConnectionProvider(redisConnectionString));

        
        //Hangfire
        services.AddHangfire(config =>
            config.UsePostgreSqlStorage(c =>
                c.UseNpgsqlConnection(databaseConnectionString)));
        
        services.AddHangfireServer();

        
        //Configure identity
        services.AddIdentity<Account, IdentityRole>(options => { }).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();
        
        services.Configure<IdentityOptions>(options =>
        {
            options.Lockout.AllowedForNewUsers = false;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.User.RequireUniqueEmail = true;
            
        });
        
        //Configure R2
        var accessKey = configuration["Storage:S3:AccessKey"];
        var secretKey = configuration["Storage:S3:SecretKey"];
        var serviceUrl = configuration["Storage:S3:ServiceURL"];

        var credentials = new BasicAWSCredentials(accessKey, secretKey);

        services.AddSingleton<IAmazonS3>(sp =>
        {
            var config = new AmazonS3Config
            {
                ServiceURL = serviceUrl,
                RequestChecksumCalculation = RequestChecksumCalculation.WHEN_REQUIRED,
                ResponseChecksumValidation = ResponseChecksumValidation.WHEN_REQUIRED,
            };

            return new AmazonS3Client(credentials, config);
        });

        services.AddSingleton<IStorageService, S3StorageService>();
        
        
        
        //Other DI
        services.AddTransient<IIdentityService, IdentityService>();
        services.AddScoped<MediaCleanupService>();
        services.AddScoped<IRoomRepository, RoomRepository>();
        services.AddScoped<IUserSessionRepository, UserSessionRepository>();
        services.AddScoped<IMediaProcessingService, MediaProcessingService>();
        services.AddScoped<IBackgroundService, HangfireJobService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddSingleton(TimeProvider.System);
        
        
        
        return services;
    }
}