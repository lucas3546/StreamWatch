using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StreamWatch.Api.Services;
using StreamWatch.Application.Common.Interfaces;
using StreamWatch.Core.Options;
using StreamWatch.Infraestructure.Services;

namespace StreamWatch.Api;

public static class ConfigureServices
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
     {
         services.Configure<StorageOptions>(configuration.GetSection("Storage"));
         
         services.AddSignalR();
         
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
                 { //Change this  in production
                     ValidateIssuer = false,
                     ValidateAudience = false,
                     ValidAudience = configuration["JWT:Audience"],
                     ValidIssuer = configuration["JWT:Issuer"],
                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                 };

                 options.Events = new JwtBearerEvents
                 {
                     OnMessageReceived = context =>
                     {
                         var accessToken = context.Request.Query["access_token"];

                         // If the request is for our hub...
                         var path = context.HttpContext.Request.Path;
                         if (!string.IsNullOrEmpty(accessToken) &&
                             (path.StartsWithSegments("/api/hubs/streamwatch")))
                         {
                             // Read the token out of the query string
                             context.Token = accessToken;

                         }
                         return Task.CompletedTask;
                     }
                 };
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
         
         return services;
     }
}