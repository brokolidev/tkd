using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using taekwondo_backend.Data;
using taekwondo_backend.Models;
using Microsoft.AspNetCore.Authorization;
using taekwondo_backend.DTO;
using taekwondo_backend.Enums;


namespace taekwondo_backend.Controllers
{
    [Route("[controller]")]
    [Authorize(Roles = nameof(UserRoles.Admin) + "," + nameof(UserRoles.Instructor))]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /events
        [HttpGet]
        public ActionResult<IEnumerable<Event>> GetSchedules(
            int pageNumber = 1,
            int pageSize = 30,
            bool openOnly = true
        )
        {
            var query = _context.Events.AsQueryable();
            
            if (openOnly)
            {
                query = query.Where(e => e.IsOpen);
            }
            
            var pagedEvents = PagedList<GetEventsDTO>.Create(
                query.OrderByDescending(e => e.CreatedAt)
                    .Select(e => new GetEventsDTO
                    {
                        Id = e.Id,
                        Title = e.Title,
                        StartsAt = e.StartsAt,
                        EndsAt = e.EndsAt,
                        IsOpen = e.IsOpen,
                        Description = e.Description,
                        CreatedAt = e.CreatedAt,
                        UpdatedAt = e.UpdatedAt
                    }),
                    pageNumber,
                    pageSize);

            return Ok(pagedEvents);
        }
        
        // POST: /events
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDTO createEventDTO)
        {
            if (createEventDTO == null)
            {
                return BadRequest("Event data is required.");
            }
            
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized("User id claim is invalid.");
            }
            var user = await _context.Users.FindAsync(userId);

            var newEvent = new Event
            {
                Title = createEventDTO.Title,
                StartsAt = createEventDTO.StartsAt,
                EndsAt = createEventDTO.EndsAt,
                Description = createEventDTO.Description,
                User = user,
                IsOpen = true, // 기본적으로 열려 있는 이벤트로 설정
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetSchedules), new { id = newEvent.Id }, newEvent);
        }
    }
}
