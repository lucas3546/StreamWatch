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
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};

forwardedHeadersOptions.KnownNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();

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