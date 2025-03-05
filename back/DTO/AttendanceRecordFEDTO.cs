using taekwondo_backend.Enums;
using taekwondo_backend.Models;

namespace taekwondo_backend.DTO
{
    public class AttendanceRecordFEDTO
    {
        public int Id { get; set; }
        public Models.Identity.User User { get; set; }
        public Schedule Schedule { get; set; }
        public DateTime DateRecorded { get; set; }

        public AttendanceRecordFEDTO()
        {
            Id = 0;
            User = new Models.Identity.User();
            Schedule = new Schedule();
            DateRecorded = DateTime.Now;
        }

        public AttendanceRecordFEDTO(int id, Models.Identity.User user, Schedule schedule, DateTime dateRecorded)
        {
            Id = id;
            User = user;
            Schedule = schedule;
            DateRecorded = dateRecorded;
        }
    }
}
