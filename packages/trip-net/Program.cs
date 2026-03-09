using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using trip_net.Infrastructure;
using trip_net.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Fixed port
builder.WebHost.UseUrls("http://localhost:5173");
builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"]!;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        };
    });

builder.Services.AddAuthorization();

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

// Services
builder.Services.AddSingleton<
    trip_net.Services.IPasswordHasher,
    trip_net.Services.PasswordHasher
>();

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITripRepository, TripRepository>();
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
    });
});

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
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
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

app.Run();
