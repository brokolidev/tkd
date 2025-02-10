using Microsoft.AspNetCore.Mvc;
using taekwondo_backend.Data;
using taekwondo_backend.Models;
using Microsoft.AspNetCore.Authorization;
using taekwondo_backend.Enums;

namespace taekwondo_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = nameof(UserRoles.Admin))]

    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        // GET /settings
        // Get the settings data from the database
        [HttpGet]
        public IActionResult GetSettings()
        {
            var settings = _context.Settings.FirstOrDefault();
            if (settings == null)
            {
                return NotFound("Settings not found");
            }
            return Ok(settings);
        }

        // PATCH /settings
        // Update settings if they exist
        [HttpPatch]
        public IActionResult UpdateSettings([FromBody] UpdateSettingDTO updatedSettings)
        {
            // Get the first settings record from the database
            var existingSettings = _context.Settings.FirstOrDefault();

            // If no settings exist, return a 503 Service Unavailable response
            if (existingSettings == null)
            {
                return StatusCode(503, "Update Settings unavailable.");
            }

            // Update the settings value if there is data.
            if (updatedSettings.OrganizationName != null)
                existingSettings.OrganizationName = updatedSettings.OrganizationName;

            if (updatedSettings.Email != null)
                existingSettings.Email = updatedSettings.Email;

            if (updatedSettings.Street != null)
                existingSettings.Street = updatedSettings.Street;

            if (updatedSettings.City != null)
                existingSettings.City = updatedSettings.City;

            if (updatedSettings.Province != null)
                existingSettings.Province = updatedSettings.Province;

            if (updatedSettings.PostalCode != null)
                existingSettings.PostalCode = updatedSettings.PostalCode;

            if (updatedSettings.Country != null)
                existingSettings.Country = updatedSettings.Country;

            if (updatedSettings.MaximumClassSize.HasValue)
                existingSettings.MaximumClassSize = updatedSettings.MaximumClassSize.Value;

            if (updatedSettings.AbsentAlert.HasValue)
                existingSettings.AbsentAlert = updatedSettings.AbsentAlert.Value;

            if (updatedSettings.PaymentAlert.HasValue)
                existingSettings.PaymentAlert = updatedSettings.PaymentAlert.Value;

            // Save the updated values
            _context.SaveChanges();

            // And return 200 with update data
            return Ok(existingSettings);
        }

    }
}
