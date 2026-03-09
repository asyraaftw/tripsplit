namespace trip_net.Domain;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}

public class VerifyPasswordRequest
{
    public int Id { get; set; }
    public string Password { get; set; } = string.Empty;
}

public class GroupTrip
{
    public int Id { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public int Pax { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string AuthKeyHash { get; set; } = string.Empty;
    public List<User> Participants { get; set; } = new();
}

public class CreateGroupTripRequest
{
    public string GroupName { get; set; } = string.Empty;
    public int Pax { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public List<string> Members { get; set; } = new();
}

public class GroupTripLoginRequest
{
    public string AuthKey { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
