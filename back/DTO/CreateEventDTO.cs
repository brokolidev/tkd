namespace taekwondo_backend.DTO;

public class CreateEventDTO
{
    public string Title { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    public string Description { get; set; }
}