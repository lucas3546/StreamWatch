using Amazon.Runtime;
using Amazon.S3;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Identity;
using StreamWatch.Core.Options;
using StreamWatch.Infraestructure.Identity;
using StreamWatch.Infraestructure.Persistence;
using StreamWatch.Infraestructure.Persistence.Interceptors;
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
        
        services.AddSingleton<IStorageService>(provider =>
        {
            var options = provider.GetRequiredService<IOptions<StorageOptions>>().Value;
            var s3 = provider.GetRequiredService<IAmazonS3>();

            return options.Provider switch
            {
                "S3" => new S3StorageService(options, s3),
                "Local" => new LocalStorageService(options),
                _ => throw new InvalidOperationException($"Unknown storage provider: {options.Provider}")
            };
        });
        
        


        
        
        //Other DI
        services.AddTransient<IIdentityService, IdentityService>();
        services.AddScoped<IMediaProcessingService, MediaProcessingService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddSingleton(TimeProvider.System);
        
        return services;
    }
}