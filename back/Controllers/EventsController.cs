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
            int pageSize = 30
        )
        {
            var pagedEvents =
                PagedList<Event>.Create(
                    _context.Events.AsQueryable()
                        .OrderByDescending(s => s.CreatedAt),
                    pageNumber,
                    pageSize);

            return Ok(pagedEvents);
        }
    }
}
