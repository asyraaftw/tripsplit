using Dapper;
using trip_net.Infrastructure;

namespace trip_net.Persistence;

public class DbInitializer
{
    private readonly IDbConnectionFactory _connectionFactory;
    private readonly ILogger<DbInitializer> _logger;

    public DbInitializer(IDbConnectionFactory connectionFactory, ILogger<DbInitializer> logger)
    {
        _connectionFactory = connectionFactory;
        _logger = logger;
    }

    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        var sqlPath = Path.Combine(AppContext.BaseDirectory, "Sql", "Main.sql");

        if (!File.Exists(sqlPath))
        {
            _logger.LogWarning("SQL init script not found at {Path}, skipping DB init.", sqlPath);
            return;
        }

        var sql = await File.ReadAllTextAsync(sqlPath, cancellationToken);

        using var connection = await _connectionFactory.CreateConnectionAsync(cancellationToken);

        _logger.LogInformation("Running database initialization script...");
        await connection.ExecuteAsync(sql);
        _logger.LogInformation("Database initialization complete.");
    }
}
