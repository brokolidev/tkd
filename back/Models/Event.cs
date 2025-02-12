
using System.ComponentModel.DataAnnotations;
using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.Models
{
    public class Event
    {
        [Required]
        public int Id { get; set; }
        
        [Required]
        public User User { get; set; }

        [Required]
        public string Title { get; set; }
        
        [Required]
        public DateTime StartsAt { get; set; }
        
        [Required]
        public DateTime EndsAt { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        [Required]
        public bool IsOpen { get; set; }
        
        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
        

        public Event()
        {
            User = new User();
            Title = string.Empty;
            StartsAt = DateTime.Now;
            EndsAt = DateTime.Now;
            Description = string.Empty;
            IsOpen = false;
            CreatedAt = DateTime.MinValue;
            UpdatedAt = DateTime.MinValue;
        }

        public Event(User user, string title, DateTime startsAt, DateTime endsAt, string description, bool isOpen)
        {
            User = user;
            Title = title;
            StartsAt = startsAt;
            EndsAt = endsAt;
            Description = description;
            IsOpen = isOpen;
        }
    }
}
