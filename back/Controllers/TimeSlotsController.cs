using System.Runtime.Intrinsics.X86;
using Microsoft.AspNetCore.Mvc;
using taekwondo_backend.Data;
using taekwondo_backend.Models;
using Microsoft.AspNetCore.Authorization;
using taekwondo_backend.DTO;
using taekwondo_backend.Enums;
using GetSchedulesDTO = taekwondo_backend.DTO.GetSchedulesDTO;


namespace taekwondo_backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TimeSlotsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TimeSlotsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /timeslots
        [HttpGet]
        public ActionResult<List<TimeSlot>> GetTimeSlots()
        {
            var timeSlots = _context.TimeSlots
                .OrderBy(t => t.StartsAt) 
                .ToList();
            
            return Ok(timeSlots);
        }
    }
}
