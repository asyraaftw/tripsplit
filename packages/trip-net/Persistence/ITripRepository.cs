using trip_net.Domain;

namespace trip_net.Persistence;

public interface ITripRepository
{
    Task<IEnumerable<Trip>> GetAllAsync();
    Task<Trip?> GetByIdAsync(int id);
    Task<Trip> CreateAsync(Trip trip);
}
