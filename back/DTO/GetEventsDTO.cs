using System.Text.RegularExpressions;
using System.Web;

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
    
    public string ShortDescription => GetShortDescription(Description, 100);
    
    // Helper method to convert HTML to plain text and truncate it
    private string GetShortDescription(string htmlText, int maxLength)
    {
        if (string.IsNullOrEmpty(htmlText))
            return string.Empty;
        
        // First decode any HTML entities
        string decodedHtml = HttpUtility.HtmlDecode(htmlText);
        
        // Remove all HTML tags
        string plainText = Regex.Replace(decodedHtml, "<[^>]*>", string.Empty);
        
        // Remove extra whitespace
        plainText = Regex.Replace(plainText, @"\s+", " ").Trim();
        
        // Truncate to the specified length, adding ellipsis if needed
        if (plainText.Length <= maxLength)
            return plainText;
        
        // Find the last space within the limit to avoid cutting words
        int lastSpace = plainText.LastIndexOf(' ', maxLength - 3);
        if (lastSpace > 0)
            return plainText.Substring(0, lastSpace) + "...";
        
        // If no space is found, just cut at the max length
        return plainText.Substring(0, maxLength - 3) + "...";
    }
}