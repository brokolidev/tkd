namespace taekwondo_backend.DTO;

public class CreateEventDTO
{
    public required string Title { get; set; }
    public required DateTime StartsAt { get; set; }
    public required DateTime EndsAt { get; set; }
    public required string Description { get; set; }
}