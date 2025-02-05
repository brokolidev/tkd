namespace taekwondo_backend.Models
{
    public class GetSchedulesDTO
    {
        public int Id { get; set; }
        public TimeSlot? TimeSlot { get; set; } // Make TimeSlot nullable
        public List<int> StudentIds { get; set; }
        public List<int> InstructorIds { get; set; }

        public GetSchedulesDTO()
        {
            StudentIds = new List<int>();
            InstructorIds = new List<int>();
        }
    }
}
