using trip_net.Domain;

namespace trip_net.Persistence;

public interface IExpenseRepository
{
    Task<IEnumerable<Expense>> GetByTripIdAsync(int tripId);
    Task<Expense?> GetByIdAsync(int id);
    Task<Expense> CreateAsync(Expense expense);
}
