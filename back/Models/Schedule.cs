using System.ComponentModel.DataAnnotations;
using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.Models
{
    public class Schedule
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public TimeSlot TimeSlot { get; set; }

        [Required]
        public List<User> Students { get; set; }

        [Required]
        public List<User> Instructors { get; set; }

        [Required]
        public DayOfWeek Day { get; set; }

        [Required]
        public string Level { get; set; }

        [Required]
        public bool IsOpen { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? ImageUrl { get; set; }

        public Schedule()
        {
            TimeSlot = new();
            Students = [];
            Instructors = [];
            Day = 0;
            Level = "Beginner Class";
            IsOpen = false;
        }

        public Schedule(
            TimeSlot timeSlot,
            List<User> students,
            List<User> instructors,
            DayOfWeek day,
            string level,
            bool isOpen,
            string imageUrl)
        {
            TimeSlot = timeSlot;
            Students = students;
            Instructors = instructors;
            Day = day;
            Level = level;
            IsOpen = isOpen;
            ImageUrl = imageUrl;
        }
    }
}
