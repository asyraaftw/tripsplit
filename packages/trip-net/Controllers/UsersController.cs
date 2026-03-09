using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using trip_net.Domain;
using trip_net.Persistence;
using trip_net.Services;

namespace trip_net.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _repo;
    private readonly IPasswordHasher _hasher;

    public UsersController(IUserRepository repo, IPasswordHasher hasher)
    {
        _repo = repo;
        _hasher = hasher;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _repo.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _repo.GetByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] User user)
    {
        user.PasswordHash = _hasher.Hash(user.PasswordHash);
        var created = await _repo.CreateAsync(user);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyPassword([FromBody] VerifyPasswordRequest request)
    {
        var user = await _repo.GetByIdAsync(request.Id);
        if (user is null)
            return NotFound();

        var isValid = _hasher.Verify(request.Password, user.PasswordHash);
        return Ok(new { isValid });
    }

    // [HttpGet("hash")]
    // public IActionResult HashValue([FromQuery] string value) =>
    //     Ok(new { plain = value, hashed = _hasher.Hash(value) });

    [HttpPost("group/register")]
    public async Task<IActionResult> RegisterGroupTrip([FromBody] CreateGroupTripRequest request)
    {
        string authKey;
        string authKeyHash;
        do
        {
            authKey = GenerateAuthKey();
            authKeyHash = HashAuthKey(authKey);
        } while (await _repo.AuthKeyExistsAsync(authKeyHash));

        var groupTrip = new GroupTrip
        {
            GroupName = request.GroupName,
            Pax = request.Pax,
            Email = request.Email,
            PasswordHash = _hasher.Hash(request.Password),
            AuthKeyHash = authKeyHash,
        };

        var created = await _repo.CreateGroupTripAsync(groupTrip, request.Members);

        Console.WriteLine($"[DEBUG] Auth key for {request.Email}: {authKey}");

        return Ok(
            new
            {
                created.Id,
                created.GroupName,
                created.Email,
            }
        );
    }

    [HttpPost("group/login")]
    public async Task<IActionResult> LoginGroupTrip([FromBody] GroupTripLoginRequest request)
    {
        var authKeyHash = HashAuthKey(request.AuthKey);
        var groupTrip = await _repo.GetGroupTripByAuthKeyAsync(authKeyHash);

        if (groupTrip is null || !_hasher.Verify(request.Password, groupTrip.PasswordHash))
            return Unauthorized(new { message = "Invalid auth key or password" });

        return Ok(
            new
            {
                groupTrip.Id,
                groupTrip.GroupName,
                groupTrip.Email,
            }
        );
    }

    private static string GenerateAuthKey() =>
        RandomNumberGenerator.GetInt32(100000, 999999).ToString();

    private static string HashAuthKey(string authKey) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(authKey)));
}
