using Hangfire;
using Microsoft.Extensions.FileProviders;
using StreamWatch.Api;
using StreamWatch.Api.Hubs;
using StreamWatch.Application;
using StreamWatch.Core.Options;
using StreamWatch.Infraestructure;
using StreamWatch.Infraestructure.Services;

var builder = WebApplication.CreateBuilder(args);
var storageOptions = builder.Configuration.GetSection("Storage").Get<S3StorageOptions>();

builder.Services.AddInfraestructureServices(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddApiServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStatusCodePages();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.UseHangfireDashboard();

RecurringJob.AddOrUpdate<MediaCleanupService>(
    "cleanup",
    svc => svc.CleanExpiredFiles(),
    Cron.Hourly
);

app.MapHub<StreamWatchHub>("api/hubs/streamwatch");

app.UseCors();

app.Run();
