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

await app.InitialiseDatabaseAsync();
Directory.CreateDirectory("wwwroot/temp");
app.UseSerilogRequestLogging();
app.UseRouting();

app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<BanCheckFactoryMiddleware>();
app.UseStatusCodePages();

app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.MapHealthChecks("/health");

app.MapHub<StreamWatchHub>("/hubs/streamwatch");
app.UseHttpLogging();
app.UseHangfireDashboard();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});


RecurringJob.AddOrUpdate<MediaCleanupService>(
    "cleanup",
    svc => svc.CleanExpiredFiles(),
    Cron.Hourly
);

RecurringJob.AddOrUpdate<BanUpdateJob>(
    "updatebans",
    svc => svc.UpdateBans(),
    Cron.Minutely
);

app.Run();