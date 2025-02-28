using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

public class EmailService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiUrl;
    private readonly string _apiToken;
    private readonly string _fromEmail;

    // Reference: Mailtrap API integration and HTML template processing with placeholders
    // Source: https://mailtrap.io/blog/asp-net-core-send-email/#Send-HTML-email1
    public EmailService(HttpClient httpClient)
    {
        _httpClient = httpClient;

        // Load configuration from secretSettings.json
        // adapted from https://chatgpt.com/c/67c1f535-e088-8008-8ea4-c2ad2d405afa
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory()) // Ensure it looks in the project root
            .AddJsonFile("secretSettings.json", optional: false, reloadOnChange: true)
            .Build();

        var mailtrapSettings = configuration.GetSection("EmailSettings");

        _apiUrl = mailtrapSettings["ApiUrl"] ?? throw new ArgumentNullException("Mailtrap API URL is missing.");
        _apiToken = mailtrapSettings["ApiToken"] ?? throw new ArgumentNullException("Mailtrap API Token is missing.");
        _fromEmail = mailtrapSettings["FromEmail"] ?? throw new ArgumentNullException("Sender email is missing.");
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