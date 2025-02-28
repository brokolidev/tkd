using Microsoft.AspNetCore.Mvc;
using taekwondo_backend.DTO;

namespace taekwondo_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        // POST /email/send
        // Send an email using a template
        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequestDTO request)
        {
            if (string.IsNullOrEmpty(request.ToEmail))
                return BadRequest("Recipient email is required.");

            if (string.IsNullOrEmpty(request.EmailType))
                return BadRequest("Email type is required.");

            // Send email using template, passing placeholders if available
            // Checked with AI from https://chatgpt.com/c/67c1f943-62d0-8008-8390-d86aab9a5751
            await _emailService.SendEmailAsync(request.ToEmail, request.Subject, request.EmailType, request.Placeholders);
            return Ok(new { Message = "Email Sent Successfully" });
        }
    }
}