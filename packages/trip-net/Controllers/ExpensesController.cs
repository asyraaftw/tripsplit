using Microsoft.AspNetCore.Mvc;
using trip_net.Domain;
using trip_net.Persistence;

namespace trip_net.Controllers;

[ApiController]
[Route("api/trips/{tripId:int}/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly IExpenseRepository _repo;

    public ExpensesController(IExpenseRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetByTrip(int tripId)
    {
        var expenses = await _repo.GetByTripIdAsync(tripId);
        return Ok(expenses);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int tripId, int id)
    {
        var expense = await _repo.GetByIdAsync(id);
        return expense is null ? NotFound() : Ok(expense);
    }

    [HttpPost]
    public async Task<IActionResult> Create(int tripId, [FromBody] Expense expense)
    {
        expense.TripId = tripId;
        var created = await _repo.CreateAsync(expense);
        return CreatedAtAction(nameof(GetById), new { tripId, id = created.Id }, created);
    }
}
