namespace trip_net.Domain;

public class Expense
{
    public int Id { get; set; }
    public int TripId { get; set; }
    public int PayerId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
