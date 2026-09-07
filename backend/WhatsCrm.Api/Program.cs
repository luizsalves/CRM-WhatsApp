using Microsoft.EntityFrameworkCore;
using WhatsCrm.Api.Extensions;
using WhatsCrm.Api.Middlewares;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicyName = "WhatsCrmFrontend";

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));

builder.Services.AddWhatsCrmDatabase(builder.Configuration);
builder.Services.AddWhatsCrmAuthentication(builder.Configuration);
builder.Services.AddWhatsCrmServices();
builder.Services.AddWhatsCrmSwagger();

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? new[] { "http://localhost:5173" };

        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<WhatsCrm.Api.Data.AppDbContext>();
    db.Database.Migrate();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection();
}

app.UseCors(CorsPolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

namespace WhatsCrm.Api
{
    /// <summary>Classe parcial exposta para permitir uso do WebApplicationFactory em testes de integração.</summary>
    public partial class Program
    {
    }
}
