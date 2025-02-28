namespace taekwondo_backend.DTO
{
    public class EmailRequestDTO
    {
        public required string ToEmail { get; set; }
        public required string Subject { get; set; }
        public required string EmailType { get; set; }
        public Dictionary<string, string>? Placeholders { get; set; }
    }
}
