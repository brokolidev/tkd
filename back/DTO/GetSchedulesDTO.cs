using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.Models
{
    public class GetSchedulesDTO
    {
        public int Id { get; set; }
        public required TimeSlot TimeSlot { get; set; } // Make TimeSlot nullable
        public required List<int> StudentIds { get; set; }
        public required List<User> Instructors { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public required string Level { get; set; }
        public DateTime? CreatedAt { get; set; }
        
        public string DayOfWeekString => DayOfWeek.ToString();
        public string MainInstructorName => Instructors.First().FirstName + " " + Instructors.First().LastName;
        public int ClassSize => StudentIds.Count;
        public string LevelImageUrl => "https://api.dicebear.com/9.x/lorelei/svg";
        public bool IsOpen { get; set; }
        
    }
}
