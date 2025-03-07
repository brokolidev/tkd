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
    }
}
