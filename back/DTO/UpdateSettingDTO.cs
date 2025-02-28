    namespace taekwondo_backend.DTO;

    public class UpdateSettingDTO
    {
        public string? OrganizationName { get; set; }
        public string? Email { get; set; }
        public string? Street { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public int? MaximumClassSize { get; set; }
        public int? AbsentAlert { get; set; }
        public int? PaymentAlert { get; set; }
    }