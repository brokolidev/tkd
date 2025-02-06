using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.Models
{
    public class GetSchedulesDTO
    {
        public int Id { get; set; }
        public TimeSlot TimeSlot { get; set; } // Make TimeSlot nullable
        public List<int> StudentIds { get; set; }
        public List<User> Instructors { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public string Level { get; set; }
        public string DayOfWeekString => DayOfWeek.ToString();
        public string MainInstructorName => Instructors.First().FirstName + " " + Instructors.First().LastName;
        public int ClassSize => StudentIds.Count;
        public string LevelImageUrl => "https://api.dicebear.com/9.x/lorelei/svg";
        public bool IsOpen { get; set; }

        public GetSchedulesDTO()
        {
            TimeSlot = new TimeSlot();
            DayOfWeek = DayOfWeek.Sunday;
            Level = "";
            StudentIds = [];
            Instructors = [];
            IsOpen = false;
        }
    }
}
