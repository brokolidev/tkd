using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using taekwondo_backend.Enums;

namespace taekwondo_backend.Models.Identity
{
    public class User : IdentityUser<int>
    {
        [PersonalData]
        public string? FirstName { get; set; }
        [PersonalData]
        public string? LastName { get; set; }
        [PersonalData]
        public DateOnly? DateOfBirth { get; set; }
        [PersonalData]
        public string? ProfileImage { get; set; }
        public BeltColorType? BeltColor { get; set; }


    }
}