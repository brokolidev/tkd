using taekwondo_backend.Enums;

namespace taekwondo_backend.DTO
{
    public class RegisterUserDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required DateOnly? DateOfBirth { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public BeltColorType? BeltColor { get; set; }
        public required string ProfileImage { get; set; }
    }
}