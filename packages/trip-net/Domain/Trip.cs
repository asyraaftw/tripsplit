namespace trip_net.Domain;

public class Trip
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string BaseCurrency { get; set; } = string.Empty;
    public int CreatedBy { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
}
