namespace taekwondo_backend.Models
{
    public class ScheduleControllerDTO
    {
        public int Id { get; set; }
        public TimeSlot? TimeSlot { get; set; } // Make TimeSlot nullable
        public List<int> StudentIds { get; set; }
        public List<int> InstructorIds { get; set; }

        public ScheduleControllerDTO()
        {
            StudentIds = new List<int>();
            InstructorIds = new List<int>();
        }
    }
}
