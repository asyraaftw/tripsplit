using trip_net.Infrastructure;
using trip_net.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Fixed port
builder.WebHost.UseUrls("http://localhost:5173");

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// PostgreSQL connection
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddSingleton<IDbConnectionFactory>(_ => new NpgsqlConnectionFactory(
    connectionString
));
builder.Services.AddSingleton<DbInitializer>();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITripRepository, TripRepository>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();

var app = builder.Build();

// Initialize database schema (uncomment to auto-create tables on startup)
// using (var scope = app.Services.CreateScope())
// {
//     var dbInitializer = scope.ServiceProvider.GetRequiredService<DbInitializer>();
//     await dbInitializer.InitializeAsync();
// }

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseMiddleware<trip_net.Infrastructure.ExceptionHandlingMiddleware>();
app.MapControllers();

app.MapGet(
        "/health/db",
        async (IDbConnectionFactory db) =>
        {
            try
            {
                using var connection = await db.CreateConnectionAsync();
                var result = await Dapper.SqlMapper.QuerySingleAsync<int>(connection, "SELECT 1");
                return Results.Ok(new { status = "healthy", database = "connected" });
            }
            catch (Exception ex)
            {
                return Results.Json(
                    new { status = "unhealthy", error = ex.Message },
                    statusCode: 503
                );
            }
        }
    )
    .WithName("HealthCheckDb");

var summaries = new[]
{
    "Freezing",
    "Bracing",
    "Chilly",
    "Cool",
    "Mild",
    "Warm",
    "Balmy",
    "Hot",
    "Sweltering",
    "Scorching",
};

app.MapGet(
        "/weatherforecast",
        () =>
        {
            var forecast = Enumerable
                .Range(1, 5)
                .Select(index => new WeatherForecast(
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
                .ToArray();
            return forecast;
        }
    )
    .WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
