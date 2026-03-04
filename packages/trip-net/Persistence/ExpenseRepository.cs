using Dapper;
using trip_net.Domain;
using trip_net.Infrastructure;

namespace trip_net.Persistence;

public class ExpenseRepository : IExpenseRepository
{
    private readonly IDbConnectionFactory _db;

    public ExpenseRepository(IDbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Expense>> GetByTripIdAsync(int tripId)
    {
        using var conn = await _db.CreateConnectionAsync();
        return await conn.QueryAsync<Expense>(
            @"SELECT id, trip_id AS TripId, payer_id AS PayerId, amount, currency, description, created_at AS CreatedAt
              FROM expenses WHERE trip_id = @TripId",
            new { TripId = tripId }
        );
    }

    public async Task<Expense?> GetByIdAsync(int id)
    {
        using var conn = await _db.CreateConnectionAsync();
        return await conn.QuerySingleOrDefaultAsync<Expense>(
            @"SELECT id, trip_id AS TripId, payer_id AS PayerId, amount, currency, description, created_at AS CreatedAt
              FROM expenses WHERE id = @Id",
            new { Id = id }
        );
    }

    public async Task<Expense> CreateAsync(Expense expense)
    {
        using var conn = await _db.CreateConnectionAsync();
        var id = await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO expenses (trip_id, payer_id, amount, currency, description)
              VALUES (@TripId, @PayerId, @Amount, @Currency, @Description)
              RETURNING id",
            expense
        );
        expense.Id = id;
        return expense;
    }
}
