using StreamWatch.Api;
using StreamWatch.Application;
using StreamWatch.Infraestructure;

var builder = WebApplication.CreateBuilder(args);

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

app.UseAuthorization();

app.MapControllers();

app.Run();