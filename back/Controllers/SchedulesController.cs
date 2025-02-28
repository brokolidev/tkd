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

        // PATCH: schedule/5
        [HttpPatch("{id:int}")]
        public ActionResult UpdateSchedule(int id, UpdateSchedulesDTO updateScheduleDTO)
        {
            var selectedSchedule = _context.Schedules.FirstOrDefault(s => s.Id == id);
            if (selectedSchedule == null)
            {
                return NotFound(new[] { $"Schedule with id {id} could not be found." });
            }
            
            // Get all properties from DTO
            var properties = typeof(UpdateSchedulesDTO).GetProperties();
            
            // To check if any changes are made
            var hasChanges = false;

            // Check if TimeSlot is provided and update it (null check)
            foreach (var property in properties)
            {
                // Get the value from input
                var newValue = property.GetValue(updateScheduleDTO);
                if (newValue == null) continue;
                
                // Find the matching property
                var entityProperty = typeof(Schedule).GetProperty(property.Name);
                if (entityProperty == null) continue;
                
                // Update the value with new values
                entityProperty.SetValue(selectedSchedule, newValue);
                hasChanges = true;
            }
            
            // Save changes to the database only if there are updates
            if (hasChanges)
            {
                _context.SaveChanges();
            }
            
            return Ok(selectedSchedule);
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
