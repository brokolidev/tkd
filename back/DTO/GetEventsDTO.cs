namespace taekwondo_backend.DTO;

public class GetEventsDTO
{
    public int Id { get; set; }
    public string Title { get; set; }
    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
    public required string Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsOpen { get; set; }
    
    public string? StartsAtFormatted => StartsAt?.ToString("yyyy-MM-dd");
    public string? EndsAtFormatted => EndsAt?.ToString("yyyy-MM-dd");
    public string imageUrl => "https://api.dicebear.com/9.x/lorelei/svg";
}