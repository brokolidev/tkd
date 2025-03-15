using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using taekwondo_backend.Models;
using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.DTO;

public class CreateScheduleDTO
{
    [Required]
    public required int TimeSlotId { get; set; }

    [Required]
    public List<int> StudentIds { get; set; } = new List<int>();

    [Required]
    public List<int> InstructorIds { get; set; } = new List<int>();

    [Required]
    public DayOfWeek Day { get; set; }

    [Required]
    public string Level { get; set; } = "Beginner Class";

    [Required]
    public bool IsOpen { get; set; }
}