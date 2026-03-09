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

    public async Task<bool> AuthKeyExistsAsync(string authKeyHash)
    {
        using var conn = await _db.CreateConnectionAsync();
        return await conn.ExecuteScalarAsync<bool>(
            "SELECT EXISTS(SELECT 1 FROM group_trips WHERE auth_key_hash = @AuthKeyHash)",
            new { AuthKeyHash = authKeyHash }
        );
    }

    public async Task<GroupTrip?> GetGroupTripByAuthKeyAsync(string authKeyHash)
    {
        using var conn = await _db.CreateConnectionAsync();
        return await conn.QuerySingleOrDefaultAsync<GroupTrip>(
            @"SELECT id, group_name AS GroupName, pax, email, password_hash AS PasswordHash, auth_key_hash AS AuthKeyHash
              FROM group_trips WHERE auth_key_hash = @AuthKeyHash",
            new { AuthKeyHash = authKeyHash }
        );
    }

    public async Task<GroupTrip> CreateGroupTripAsync(GroupTrip groupTrip, List<string> members)
    {
        using var conn = await _db.CreateConnectionAsync();
        using var tx = conn.BeginTransaction();

        var id = await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO group_trips (group_name, pax, email, password_hash, auth_key_hash)
              VALUES (@GroupName, @Pax, @Email, @PasswordHash, @AuthKeyHash)
              RETURNING id",
            groupTrip,
            tx
        );
        groupTrip.Id = id;

        foreach (var name in members)
        {
            await conn.ExecuteAsync(
                "INSERT INTO group_trip_members (group_trip_id, name) VALUES (@GroupTripId, @Name)",
                new { GroupTripId = id, Name = name },
                tx
            );
        }

        tx.Commit();
        return groupTrip;
    }
}
