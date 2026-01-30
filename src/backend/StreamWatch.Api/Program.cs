using System.Net;
using System.Text.Json;
using Hangfire;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using Serilog;
using StreamWatch.Api;
using StreamWatch.Api.Hubs;
using StreamWatch.Api.Infraestructure.Middlewares;
using StreamWatch.Application;
using StreamWatch.Core.Options;
using StreamWatch.Infraestructure;
using StreamWatch.Infraestructure.Jobs;
using StreamWatch.Infraestructure.Persistence;
using StreamWatch.Infraestructure.Services;
using IPNetwork = Microsoft.AspNetCore.HttpOverrides.IPNetwork;

var builder = WebApplication.CreateBuilder(args);

var storageOptions = builder.Configuration.GetSection("Storage").Get<S3StorageOptions>();

builder.Host.UseSerilog((context, services, config) =>
{
    config.ReadFrom.Configuration(context.Configuration);
});

builder.Services.AddInfraestructureServices(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto
};


forwardedHeadersOptions.KnownNetworks.Add(
    new IPNetwork(IPAddress.Parse("172.18.0.8"), 16)
);


app.UseForwardedHeaders(forwardedHeadersOptions);

await app.InitialiseDatabaseAsync();

Directory.CreateDirectory("wwwroot/temp");

app.UseSerilogRequestLogging();
app.UseRouting();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<BanCheckFactoryMiddleware>();
app.UseStatusCodePages();



app.MapControllers();

app.MapHealthChecks("/health");

app.MapHub<StreamWatchHub>("/hubs/streamwatch");
app.UseHttpLogging();
app.UseHangfireDashboard();

app.MapGet("/debug/request", (HttpContext context) =>
{
    var remoteIp = context.Connection.RemoteIpAddress;
    if (remoteIp?.IsIPv4MappedToIPv6 == true)
        remoteIp = remoteIp.MapToIPv4();

    var result = new
    {
        RemoteIp = remoteIp?.ToString(),
        RemoteIpRaw = context.Connection.RemoteIpAddress?.ToString(),
        LocalIp = context.Connection.LocalIpAddress?.ToString(),
        Scheme = context.Request.Scheme,
        Method = context.Request.Method,
        Path = context.Request.Path.ToString(),
        Headers = context.Request.Headers
            .ToDictionary(h => h.Key, h => h.Value.ToString())
    };

    return Results.Json(result, new JsonSerializerOptions
    {
        WriteIndented = true
    });
});



RecurringJob.AddOrUpdate<MediaCleanupJob>(
    "mediacleanup",
    svc => svc.CleanExpiredFiles(),
    Cron.Hourly
);

RecurringJob.AddOrUpdate<BanUpdateJob>(
    "updatebans",
    svc => svc.UpdateBans(),
    Cron.Minutely
);

RecurringJob.AddOrUpdate<RoomsCleanupJob>(
    "roomscleanup",
    svc => svc.RemoveEmptyRooms(),
    Cron.Minutely
);

app.Run();