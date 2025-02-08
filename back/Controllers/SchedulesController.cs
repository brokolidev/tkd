using System.Runtime.Intrinsics.X86;
using Microsoft.AspNetCore.Mvc;
using taekwondo_backend.Data;
using taekwondo_backend.Models;
using Microsoft.AspNetCore.Authorization;
using taekwondo_backend.Enums;


namespace taekwondo_backend.Controllers
{
    [Route("[controller]")]
    [Authorize(Roles = nameof(UserRoles.Admin) + "," + nameof(UserRoles.Instructor))]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SchedulesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /schedule
        [HttpGet]
        public ActionResult<IEnumerable<GetSchedulesDTO>> GetSchedules(
            int pageNumber = 1, 
            int pageSize = 30, 
            bool openOnly = true
            )
        {
            var pagedSchedules = 
                PagedList<GetSchedulesDTO>.Create(
                    _context.Schedules.AsQueryable()
                        .Where(s => !openOnly || s.IsOpen)
                        .OrderByDescending(s => s.CreatedAt)
                        .Select(s => new GetSchedulesDTO
                        {
                            Id = s.Id,
                            TimeSlot = s.TimeSlot,
                            StudentIds = s.Students.Select(st => st.Id).ToList(),
                            Instructors = s.Instructors,
                            DayOfWeek = s.Day,
                            Level = s.Level,
                            CreatedAt = s.CreatedAt,
                        }), 
                    pageNumber, 
                    pageSize);
            
            return Ok(pagedSchedules);
        }

        // // GET: schedule/5
        // [HttpGet("/{id}")]
        // public ActionResult<GetSchedulesDTO> GetSchedule(int id)
        // {
        //     var schedule = _context.Schedules
        //         .Where(s => s.Id == id)
        //         .Select(s => new GetSchedulesDTO
        //         {
        //             Id = s.Id,
        //             TimeSlot = s.TimeSlot,
        //             StudentIds = s.Students.Select(st => st.Id).ToList(),
        //             Instructors = s.Instructors,
        //             DayOfWeek = s.Day,
        //             Level = s.Level
        //         }).FirstOrDefault();
        //
        //     if (schedule == null)
        //     {
        //         return NotFound();
        //     }
        //
        //     return Ok(schedule);
        // }

        // POST: schedule
        // [HttpPost]
        // public ActionResult<Schedule> CreateSchedule(GetSchedulesDTO scheduleDTO)
        // {
        //     // Map DTO to Schedule model
        //     var students = _context.Users.Where(u => scheduleDTO.StudentIds.Contains(u.Id)).ToList();
        //     var instructors = scheduleDTO.Instructors;
        //
        //     // Ensure students and instructors are valid and not empty
        //     if (students == null || students.Count == 0 || instructors == null || instructors.Count == 0)
        //     {
        //         return BadRequest(new[] { "At least one student and one instructor must be assigned." });
        //     }
        //
        //     if (scheduleDTO.TimeSlot == null)
        //     {
        //         return BadRequest(new[] { "TimeSlot cannot be null." });
        //     }
        //
        //     // Initialize Schedule with Instructors and Students explicitly
        //     var schedule = new Schedule
        //     {
        //         TimeSlot = scheduleDTO.TimeSlot,
        //         Students = students,
        //         Instructors = instructors
        //     };
        //
        //     _context.Schedules.Add(schedule);
        //     _context.SaveChanges();
        //
        //     return CreatedAtAction(nameof(GetSchedule), new { id = schedule.Id }, schedule);
        // }

        // PUT: schedule/5
        [HttpPut("{id}")]
        public ActionResult UpdateSchedule(int id, GetSchedulesDTO scheduleDTO)
        {
            var schedule = _context.Schedules.FirstOrDefault(s => s.Id == id);
            if (schedule == null)
            {
                return NotFound(new[] { $"Schedule with id {id} could not be found." });
            }

            // Check if TimeSlot is provided and update it (null check)
            if (scheduleDTO.TimeSlot != null)
            {
                schedule.TimeSlot = scheduleDTO.TimeSlot;
            }
            else
            {
                return BadRequest(new[] { "TimeSlot cannot be null." });
            }

            // Ensure instructors and students are properly assigned (non-null and valid)
            var students = _context.Users.Where(u => scheduleDTO.StudentIds.Contains(u.Id)).ToList();
            var instructors = scheduleDTO.Instructors;

            // Ensure that Instructors and Students lists are not null or empty
            if (students == null || instructors == null || students.Count == 0 || instructors.Count == 0)
            {
                return BadRequest(new[] { "At least one student and one instructor must be assigned." });
            }

            // Update the schedule
            schedule.Students = students;
            schedule.Instructors = instructors;

            // Save changes to the database
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: schedule/5
        [HttpDelete("{id}")]
        public ActionResult DeleteSchedule(int id)
        {
            var schedule = _context.Schedules.FirstOrDefault(s => s.Id == id);
            if (schedule == null)
            {
                return NotFound();
            }

            _context.Schedules.Remove(schedule);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
