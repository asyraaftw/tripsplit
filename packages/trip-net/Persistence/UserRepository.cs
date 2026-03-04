using Dapper;
using trip_net.Domain;
using trip_net.Infrastructure;

namespace trip_net.Persistence;

public class UserRepository : IUserRepository
{
    private readonly IDbConnectionFactory _db;

    public UserRepository(IDbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        using var conn = await _db.CreateConnectionAsync();
        return await conn.QueryAsync<User>(
            "SELECT id, name, email, password_hash AS PasswordHash FROM users"
        );
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        using var conn = await _db.CreateConnectionAsync();
        return await conn.QuerySingleOrDefaultAsync<User>(
            "SELECT id, name, email, password_hash AS PasswordHash FROM users WHERE id = @Id",
            new { Id = id }
        );
    }

    public async Task<User> CreateAsync(User user)
    {
        using var conn = await _db.CreateConnectionAsync();
        var id = await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO users (name, email, password_hash)
              VALUES (@Name, @Email, @PasswordHash)
              RETURNING id",
            user
        );
        user.Id = id;
        return user;
    }
}
