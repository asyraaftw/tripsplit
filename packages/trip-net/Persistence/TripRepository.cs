using Dapper;
using trip_net.Domain;
using trip_net.Infrastructure;

namespace trip_net.Persistence;

public class TripRepository : ITripRepository
{
    private readonly IDbConnectionFactory _db;

    public TripRepository(IDbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Trip>> GetAllAsync()
    {
        using var conn = await _db.CreateConnectionAsync();
        return await conn.QueryAsync<Trip>(
            "SELECT id, name, base_currency AS BaseCurrency, created_by AS CreatedBy, start_date AS StartDate, end_date AS EndDate FROM trips"
        );
    }

    public async Task<Trip?> GetByIdAsync(int id)
    {
        using var conn = await _db.CreateConnectionAsync();
        return await conn.QuerySingleOrDefaultAsync<Trip>(
            "SELECT id, name, base_currency AS BaseCurrency, created_by AS CreatedBy, start_date AS StartDate, end_date AS EndDate FROM trips WHERE id = @Id",
            new { Id = id }
        );
    }

    public async Task<Trip> CreateAsync(Trip trip)
    {
        using var conn = await _db.CreateConnectionAsync();
        var id = await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO trips (name, base_currency, created_by, start_date, end_date)
              VALUES (@Name, @BaseCurrency, @CreatedBy, @StartDate, @EndDate)
              RETURNING id",
            trip
        );
        trip.Id = id;
        return trip;
    }
}
