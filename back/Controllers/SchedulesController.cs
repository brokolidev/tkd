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
                            ImageUrl = s.ImageUrl
                        }),
                    pageNumber,
                    pageSize);

            return Ok(pagedSchedules);
        }

        // GET: /Schedules/{id}
        [HttpGet("{id:int}")]
        public ActionResult<GetSchedulesDTO> GetScheduleById(int id)
        {
            // Retrieve the schedule using the provided id from the database.
            var scheduleDTO = _context.Schedules
                .Where(s => s.Id == id)
                .Select(s => new GetSchedulesDTO
                {
                    Id = s.Id,
                    TimeSlot = s.TimeSlot,
                    StudentIds = s.Students.Select(student => student.Id).ToList(),
                    Instructors = s.Instructors, // Adjust mapping as needed
                    DayOfWeek = s.Day,
                    Level = s.Level,
                    CreatedAt = s.CreatedAt,
                    ImageUrl = s.ImageUrl
                })
                .FirstOrDefault();

            // If the schedule is not found, return a 404 Not Found response.
            if (scheduleDTO == null)
            {
                return NotFound(new[] { "Schedule not found." });
            }

            // Return the schedule data.
            return Ok(scheduleDTO);
        }

        // POST: schedule
        [HttpPost]
        public ActionResult<Schedule> CreateSchedule([FromBody] CreateScheduleDTO scheduleDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Query Users for student IDs provided in the DTO.
            if (scheduleDTO.StudentIds == null || !scheduleDTO.StudentIds.Any())
            {
                return BadRequest(new[] { "At least one valid student is required." });
            }

            var students = _context.Users
                .Where(u => scheduleDTO.StudentIds.Contains(u.Id))
                .ToList();

            // Query Users for student IDs provided in the DTO.
            if (scheduleDTO.InstructorIds == null || !scheduleDTO.InstructorIds.Any())
            {
                return BadRequest(new[] { "At least one valid instructor is required." });
            }

            // Query Users for instructor IDs provided in the DTO.
            var instructors = _context.Users
                .Where(u => scheduleDTO.InstructorIds.Contains(u.Id))
                .ToList();

            var timeslot = _context.TimeSlots.FirstOrDefault(ts => ts.Id == scheduleDTO.TimeSlotId);

            if (timeslot == null)
            {
                return BadRequest(new[] { "Invalid TimeSlotId provided." });
            }

            // Create a Schedule entity from the DTO.
            var schedule = new Schedule
            {
                TimeSlot = timeslot,
                Students = students,
                Instructors = instructors,
                Day = scheduleDTO.Day,
                Level = scheduleDTO.Level,
                IsOpen = scheduleDTO.IsOpen,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow, // Set the UpdatedAt field to the current time.
                ImageUrl = scheduleDTO.ImageUrl
            };

            _context.Schedules.Add(schedule);
            _context.SaveChanges();

            // Assume there exists a GET endpoint (e.g., GetScheduleById) to retrieve the created schedule.
            return CreatedAtAction(nameof(GetScheduleById), new { id = schedule.Id }, schedule);
        }


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
