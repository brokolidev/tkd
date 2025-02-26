using System.ComponentModel.DataAnnotations;

namespace taekwondo_backend.Models
{
    public class AttendanceRecord
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime DateRecorded { get; set; }
    }
}
