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
}
