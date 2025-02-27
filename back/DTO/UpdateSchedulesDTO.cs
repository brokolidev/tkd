using taekwondo_backend.Models;
using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.DTO;

public class UpdateSchedulesDTO
{
    public TimeSlot? TimeSlot { get; set; } // Make TimeSlot nullable
    public List<int>? StudentIds { get; set; }
    public List<User>? Instructors { get; set; }
    public DayOfWeek? DayOfWeek { get; set; }
    public string? Level { get; set; }
    public DateTime? CreatedAt { get; set; }
    public bool? IsOpen { get; set; }
        
}