using Microsoft.AspNetCore.Mvc;
using trip_net.Domain;
using trip_net.Persistence;

namespace trip_net.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly ITripRepository _repo;

    public TripsController(ITripRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var trips = await _repo.GetAllAsync();
        return Ok(trips);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var trip = await _repo.GetByIdAsync(id);
        return trip is null ? NotFound() : Ok(trip);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Trip trip)
    {
        var created = await _repo.CreateAsync(trip);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }
}
