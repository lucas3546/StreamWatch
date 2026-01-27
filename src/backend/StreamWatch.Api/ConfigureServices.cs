using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StreamWatch.Api.Infraestructure.Middlewares;
using StreamWatch.Api.Infraestructure.Services;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Options;
using StreamWatch.Infraestructure.Services;

namespace StreamWatch.Api;

public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<S3StorageOptions>(configuration.GetSection("Storage"));

        services.AddTransient<BanCheckFactoryMiddleware>(); 
        
        services.AddHealthChecks();

        services.AddSignalR();
         
         services.AddHttpLogging(o =>
        {
            o.LoggingFields = HttpLoggingFields.RequestMethod
                            | HttpLoggingFields.RequestPath
                            | HttpLoggingFields.ResponseStatusCode
                            | HttpLoggingFields.Duration;
        });

         
         services.AddCors(options =>
         {
             options.AddDefaultPolicy(policy =>
             {
                 policy.WithOrigins("http://localhost:5173", "http://localhost:4173") // frontend
                     .AllowAnyHeader()
                     .AllowAnyMethod()
                     .AllowCredentials();
             });
         });
         
         services.AddAuthentication(options =>
             {
                 options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                 options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                 options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
             })
             .AddJwtBearer(options =>
             {
                 string? jwtKey = configuration["JWT:Key"];
                 if(string.IsNullOrEmpty(jwtKey)) throw new ArgumentNullException("JWT KEY is null or empty");

                 options.SaveToken = true;
                 options.RequireHttpsMetadata = false;
                 options.TokenValidationParameters = new TokenValidationParameters()
                 { 
                    
                     ValidateIssuer = true,
                     ValidateAudience = true,
                     ValidAudience = configuration["JWT:Audience"],
                     ValidIssuer = configuration["JWT:Issuer"],
                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                 };

                 options.Events = new JwtBearerEvents
                 {
                     OnMessageReceived = context =>
                     {
                         var accessToken = context.Request.Query["access_token"];

                         // If the request is for the hub
                         var path = context.HttpContext.Request.Path;
                         if (!string.IsNullOrEmpty(accessToken) &&
                             (path.StartsWithSegments("/hubs/streamwatch")))
                         {
                             // Read the token out of the query string
                             context.Token = accessToken;

                         }
                         return Task.CompletedTask;
                     }
                 };
             });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("Moderation", policy =>
                policy.RequireRole("Admin", "Mod")
            );
        });    
         
         services.AddRouting(options =>
         {
             options.LowercaseUrls = true;
             options.LowercaseQueryStrings = true;
         });
         services.AddHttpContextAccessor();
         services.AddControllers().AddJsonOptions(options =>
         {
             options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
         });;
         services.AddProblemDetails();
         services.AddOpenApi();
         services.AddScoped<ICurrentUserService, CurrentUserService>();
         services.AddSwaggerGen(c =>
         {
             c.EnableAnnotations();
             c.AddSecurityDefinition("StreamWatch", new OpenApiSecurityScheme() 
             {
                 Type = SecuritySchemeType.Http,
                 Scheme = "Bearer",
                 Name = "Authorization",
                 In = ParameterLocation.Header,
                 Description = "Enter the JWT:"
             });

             c.AddSecurityRequirement(new OpenApiSecurityRequirement
             {
                 {
                     new OpenApiSecurityScheme
                     {
                         Reference = new OpenApiReference
                         {
                             Type = ReferenceType.SecurityScheme,
                             Id = "StreamWatch" }
                     }, new List<string>() }
             });
         });
         
        services.AddSingleton<IUserIdProvider, NameUserIdProvider>();

        services.AddSingleton<IRealtimeMessengerService, RealtimeMessengerService>();


        services.AddRateLimiter(options =>
        {
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetSlidingWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    factory: _ => new SlidingWindowRateLimiterOptions
                    {
                        PermitLimit = 200,                
                        Window = TimeSpan.FromMinutes(1),  
                        SegmentsPerWindow = 2,             
                        QueueLimit = 0,                    
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                    })
            );

            options.AddPolicy("OnceEvery5Minutes", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "default",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 3,             
                        Window = TimeSpan.FromMinutes(5), 
                        QueueLimit = 0,
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                    }));
            
            options.AddPolicy("OnceEvery30Seconds", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "default",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 1,             
                        Window = TimeSpan.FromSeconds(30), 
                        QueueLimit = 0,
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                    }));
            
            options.AddPolicy("OnceEvery10Seconds", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "default",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 1,             
                        Window = TimeSpan.FromSeconds(10), 
                        QueueLimit = 0,
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                    }));

            options.AddPolicy("OnceEvery5Seconds", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "default",
                    factory: _ => new FixedWindowRateLimiterOptions
                    {
                        PermitLimit = 1,             
                        Window = TimeSpan.FromSeconds(5), 
                        QueueLimit = 0,
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                    }));        
                    
             options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            options.OnRejected = async (context, cancellationToken) =>
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;

                if (context.Lease.TryGetMetadata(
                    MetadataName.RetryAfter,
                    out var retryAfter))
                {
                    // retryAfter es TimeSpan
                    context.HttpContext.Response.Headers.RetryAfter =
                        ((int)retryAfter.TotalSeconds).ToString();
                }

                var problem = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc6585#section-4",
                    Title = "Too Many Requests",
                    Status = StatusCodes.Status429TooManyRequests,
                    Detail = retryAfter != null
                        ? $"Retry after {Math.Ceiling(retryAfter.TotalSeconds)} seconds."
                        : "You have exceeded the allowed request limit."
                };

                context.HttpContext.Response.ContentType = "application/problem+json";

                await context.HttpContext.Response.WriteAsJsonAsync(problem, cancellationToken);
            };

        });
 
        return services;
     }
}