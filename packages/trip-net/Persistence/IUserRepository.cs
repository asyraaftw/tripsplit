using trip_net.Domain;

namespace trip_net.Persistence;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(int id);
    Task<User> CreateAsync(User user);
    Task<GroupTrip> CreateGroupTripAsync(GroupTrip groupTrip, List<string> members);
    Task<bool> AuthKeyExistsAsync(string authKeyHash);
    Task<GroupTrip?> GetGroupTripByAuthKeyAsync(string authKeyHash);
}
