using System.ComponentModel.DataAnnotations;
using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.Models
{
    public class Schedule
    {
        [Required]
        public int Id { get; set; }

        //The time slot can't be empty. if there is a schedule, there will be an associated timeslot.
        [Required] //This property tells the db that this is a required field without the program throwing errors
        public TimeSlot TimeSlot { get; set; }

        //The students and intstructor lists must be defined, but don't need users added.
        //The required only ensures the property is not null.
        [Required] //This property tells the db that this is a required field without the program throwing errors
        public List<User> Students { get; set; }

        [Required] //This property tells the db that this is a required field without the program throwing errors
        public required List<User> Instructors { get; set; }

        public Schedule()
        {
            this.TimeSlot = new();
            this.Students = [];
            this.Instructors = [];
        }

        public Schedule(TimeSlot timeSlot, List<User> Students, List<User> Instructors)
        {
            this.TimeSlot = timeSlot;
            this.Students = Students;
            this.Instructors = Instructors;
        }
    }
}
