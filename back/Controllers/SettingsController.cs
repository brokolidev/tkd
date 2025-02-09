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

        // PUT /settings
        // Update settings if they exist, or create new settings if none exist
        [HttpPut]
        public IActionResult UpdateSettings([FromBody] Setting updatedSettings)
        {
            var existingSettings = _context.Settings.FirstOrDefault();

            // Check if there is existing settings db
            if (existingSettings == null)
            {
                var newSettings = new Setting
                {
                    // If no setting exist, create a new one
                    OrganizationName = updatedSettings.OrganizationName,
                    Email = updatedSettings.Email,
                    Street = updatedSettings.Street,
                    City = updatedSettings.City,
                    Province = updatedSettings.Province,
                    PostalCode = updatedSettings.PostalCode,
                    Country = updatedSettings.Country,
                    MaximumClassSize = updatedSettings.MaximumClassSize,
                    AbsentAlert = updatedSettings.AbsentAlert,
                    PaymentAlert = updatedSettings.PaymentAlert
                };

                // Save the new settings to the db
                _context.Settings.Add(newSettings);
                _context.SaveChanges();

                // Return HTTP 201 Created with the new settings
                return CreatedAtAction(nameof(GetSettings), new { }, newSettings);
            }

            // If settings exist, update with new values
            existingSettings.OrganizationName = updatedSettings.OrganizationName;
            existingSettings.Email = updatedSettings.Email;
            existingSettings.Street = updatedSettings.Street;
            existingSettings.City = updatedSettings.City;
            existingSettings.Province = updatedSettings.Province;
            existingSettings.PostalCode = updatedSettings.PostalCode;
            existingSettings.Country = updatedSettings.Country;
            existingSettings.MaximumClassSize = updatedSettings.MaximumClassSize;
            existingSettings.AbsentAlert = updatedSettings.AbsentAlert;
            existingSettings.PaymentAlert = updatedSettings.PaymentAlert;

            // Save the updated settings to the database
            _context.SaveChanges();

            // Return HTTP 200 OK with updated settings
            return Ok(existingSettings);
        }
    }
}
