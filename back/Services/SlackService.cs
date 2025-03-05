using System.Text;
using System.Text.Json;


namespace taekwondo_backend.Services
{
    // Reference: Sending automatic messages to Slack from ASP.NET Core 
    // Source: https://medium.com/streamwriter/sending-automatic-messages-to-slack-from-asp-net-core-with-hangfire-86b60d09b289
    public class SlackService
    {
        private readonly HttpClient _httpClient;
        private readonly string _webhookUrl;

        public SlackService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();

            // Get Slack webhook URL from the app settings
            var slackSettings = configuration.GetSection("SlackSettings");
            _webhookUrl = slackSettings["WebhookUrl"] ?? throw new ArgumentNullException("Slack Webhook URL is missing.");

        }

        // This is method to send a Slack alert message
        public async Task SendSlackAlertAsync(string text)
        {
            // Create JSON object with the message text
            var contentObject = new { text = text };
            var contentObjectJson = JsonSerializer.Serialize(contentObject);

            // Convert JSON to HTTP content with the correct format
            var content = new StringContent(contentObjectJson, Encoding.UTF8, "application/json");

            // Send the HTTP POST request to Slack webhook Url
            var response = await _httpClient.PostAsync(_webhookUrl, content);
            // If the request fails, throw an exception with details
            if (!response.IsSuccessStatusCode)
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to send Slack alert. Status Code: {response.StatusCode}, Response: {errorMessage}");
            }
        }
    }
}
