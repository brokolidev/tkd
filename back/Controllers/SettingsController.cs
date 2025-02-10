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

            // Get all properties from DTO
            var properties = typeof(UpdateSettingDTO).GetProperties();

            // To check if any changes are made
            bool hasChanges = false;

            foreach (var property in properties)
            {
                // Get the value from input
                var newValue = property.GetValue(updatedSettings);
                if (newValue != null)
                {
                    // Find the matching property
                    var entityProperty = typeof(Setting).GetProperty(property.Name);
                    if (entityProperty != null)
                    {
                        // Update the value with new values
                        entityProperty.SetValue(existingSettings, newValue);
                        hasChanges = true;
                    }
                }
            }
            // Save changes to the database only if there are updates
            if (hasChanges)
            {
                _context.SaveChanges();
            }

            // Return 200 with updated settings
            return Ok(existingSettings);
        }

    }
}
