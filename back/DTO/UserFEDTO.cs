using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using taekwondo_backend.Enums;
using taekwondo_backend.Models;

namespace taekwondo_backend.DTO
{
    public class UserFEDTO
    {
        public int Id { get; set; }
        // public UserRoleType Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly? BirthDate { get; set; }
        public string Email { get; set; }
        public BeltColorType? BeltColor { get; set; }

        public UserFEDTO()
        {
            Id = 0;
            // Role = UserRoleType.Unknown;
            FirstName = string.Empty;
            LastName = string.Empty;
            Email = string.Empty;
            BirthDate = null;
        }

        public UserFEDTO(int id, string firstName, string lastName, string email, DateOnly? birthDate, BeltColorType? beltColor)
        {
            Id = id;
            // Role = role;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            BirthDate = birthDate;
            BeltColor = beltColor;
        }
    }
}
