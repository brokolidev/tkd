using System.ComponentModel.DataAnnotations;

namespace taekwondo_backend.Models
{
    public class TimeSlot
    {
        [Required]
        public int Id { get; set; }

        [Required] public TimeOnly StartsAt { get; set; }

        [Required] public TimeOnly EndsAt { get; set; }

        [Required]
        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public TimeSlot()
        {
            StartsAt = TimeOnly.MinValue;
            EndsAt = TimeOnly.MinValue;
            CreatedAt = DateTime.MinValue;
        }

        public TimeSlot(TimeOnly startsAt, TimeOnly endsAt)
        {
            StartsAt = startsAt;
            EndsAt = endsAt;
        }
    }
}
