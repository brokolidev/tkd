using System.ComponentModel.DataAnnotations;

namespace taekwondo_backend.Models
{
    public class Setting
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string OrganizationName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Street { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Province { get; set; }

        [Required]
        public string PostalCode { get; set; }

        [Required]
        public string Country { get; set; } = "Canada";

        [Required]
        public int MaximumClassSize { get; set; }

        [Required]
        public int AbsentAlert { get; set; }

        [Required]
        public int PaymentAlert { get; set; }

        public Setting()
        {
            OrganizationName = string.Empty;
            Email = string.Empty;
            Street = string.Empty;
            City = string.Empty;
            Province = string.Empty;
            PostalCode = string.Empty;
            Country = "Canada";
            MaximumClassSize = 0;
            AbsentAlert = 0;
            PaymentAlert = 0;
        }

        public Setting(
            string organizationName,
            string email,
            string street,
            string city,
            string province,
            string postalCode,
            string country,
            int maximumClassSize,
            int absentAlert,
            int paymentAlert
        )
        {
            OrganizationName = organizationName;
            Email = email;
            Street = street;
            City = city;
            Province = province;
            PostalCode = postalCode;
            Country = country;
            MaximumClassSize = maximumClassSize;
            AbsentAlert = absentAlert;
            PaymentAlert = paymentAlert;
        }
    }
}