using taekwondo_backend.Enums;

namespace taekwondo_backend.DTO
{
    public class LoggedInUserDTO
    {
        public required int Id { get; set; }
        public required string Email { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public BeltColorType? BeltColor { get; set; }
        public string? ProfileImage { get; set; }
        public string Role { get; set; }
    }
}