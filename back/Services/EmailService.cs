using System.Text;
using System.Text.Json;

public class EmailService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiUrl;
    private readonly string _apiToken;
    private readonly string _fromEmail;

    public EmailService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;

        _apiUrl = Environment.GetEnvironmentVariable("API_URL") ?? throw new ArgumentNullException("Mailtrap API URL is missing.");
        _apiToken = Environment.GetEnvironmentVariable("MAILTRAP_API_TOKEN") ?? throw new ArgumentNullException("Mailtrap API Token is missing.");
        _fromEmail = Environment.GetEnvironmentVariable("FROM_EMAIL") ?? throw new ArgumentNullException("Sender email is missing.");
    }

    public async Task SendEmailAsync(string toEmail, string subject, string emailType, Dictionary<string, string>? placeholders = null)
    {
        // Choose the correct email template file based on emailType
        string fileName = emailType switch
        {
            "AbsenceReminder" => "AbsenceReminder.html",
            "PaymentReminder" => "PaymentReminder.html",
            _ => throw new ArgumentException("Invalid email type")
        };

        // Get the file path of the email template
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", fileName);

        // Check if the file exists, if not, throw an error
        if (!File.Exists(filePath))
            throw new FileNotFoundException($"Email template '{fileName}' not found.");

        string emailTemplateText = await File.ReadAllTextAsync(filePath);

        // Replace placeholders in the email template with actual values
        if (placeholders != null)
        {
            foreach (var placeholder in placeholders)
            {
                emailTemplateText = emailTemplateText.Replace($"{{{placeholder.Key}}}", placeholder.Value);
            }
        }

        // Create the email data in JSON format for Mailtrap API
        var emailData = new
        {
            from = new { email = _fromEmail }, // Sender email
            to = new[] { new { email = toEmail } }, // Recipient email
            subject,  // Email subject
            html = emailTemplateText // The processed HTML email content
        };

        // Convert the email data to JSON
        // This is necessary because the Mailtrap API only accepts JSON data.
        var jsonContent = JsonSerializer.Serialize(emailData);
        // Create the HTTP request content with JSON data
        var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        // Set the authorization header with Mailtrap API token
        _httpClient.DefaultRequestHeaders.Clear();
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiToken}");

        // Send the email request to Mailtrap API
        var response = await _httpClient.PostAsync(_apiUrl, httpContent);

        if (!response.IsSuccessStatusCode)
        {
            var errorResponse = await response.Content.ReadAsStringAsync();
            throw new Exception($"Failed to send email: {response.StatusCode} - {errorResponse}");
        }

        Console.WriteLine($"Email ({emailType}) sent successfully using Mailtrap API!");
    }
}