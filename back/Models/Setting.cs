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
        public string Address { get; set; }

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
            Address = string.Empty;
            MaximumClassSize = 0;
            AbsentAlert = 0;
            PaymentAlert = 0;
        }

        public Setting(
            string organizationName,
            string email,
            string address,
            int maximumClassSize,
            int absentAlert,
            int paymentAlert
        )
        {
            OrganizationName = organizationName;
            Email = email;
            Address = address;
            MaximumClassSize = maximumClassSize;
            AbsentAlert = absentAlert;
            PaymentAlert = paymentAlert;
        }
    }
}