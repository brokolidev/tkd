using taekwondo_backend.Enums;

namespace taekwondo_backend.DTO
{
    public class UserFEDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string Email { get; set; }
        public BeltColorType? BeltColor { get; set; }
        public UserRoles Role { get; set; }
        public string ProfileImage { get; set; }

        public UserFEDTO()
        {
            Id = 0;
            // Role = UserRoleType.Unknown;
            FirstName = string.Empty;
            LastName = string.Empty;
            Email = string.Empty;
            DateOfBirth = null;
            Role = UserRoles.Student;
            ProfileImage = string.Empty;
        }

        public UserFEDTO(int id, string firstName, string lastName, string email, DateOnly? birthDate, BeltColorType? beltColor, UserRoles role, string? profileImage)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            DateOfBirth = birthDate;
            BeltColor = beltColor;
            Role = role;
            ProfileImage = profileImage;
        }
    }
}
