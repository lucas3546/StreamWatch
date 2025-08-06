using Microsoft.Extensions.FileProviders;
using StreamWatch.Api;
using StreamWatch.Application;
using StreamWatch.Core.Options;
using StreamWatch.Infraestructure;

var builder = WebApplication.CreateBuilder(args);
var storageOptions = builder.Configuration.GetSection("Storage").Get<StorageOptions>();

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

if (storageOptions.Provider == "Local")
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(
            Path.Combine(Directory.GetCurrentDirectory(), storageOptions.BaseLocalPath, "media")),
        RequestPath = "/media"
    });
}



app.Run();