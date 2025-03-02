using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace taekwondo_backend.Services
{
    public class SlackService
    {
        private readonly HttpClient _httpClient;
        private readonly string _webhookUrl;

        public SlackService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();

            var slackSettings = configuration.GetSection("SlackSettings");
            _webhookUrl = slackSettings["WebhookUrl"] ?? throw new ArgumentNullException("Slack Webhook URL is missing.");

        }

        public async Task SendSlackAlertAsync(string text)
        {
            var contentObject = new { text = text };
            var contentObjectJson = JsonSerializer.Serialize(contentObject);
            var content = new StringContent(contentObjectJson, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(_webhookUrl, content);
            if (!response.IsSuccessStatusCode)
            {
                var errorMessage = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to send Slack alert. Status Code: {response.StatusCode}, Response: {errorMessage}");
            }
        }
    }
}
