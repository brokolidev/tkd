using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Net;
using System.Text;
using taekwondo_backend.Controllers;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using taekwondo_backend.Models;
using static back.Tests.EventsControllerTests;
using taekwondo_backend;
using System.Net.Http.Headers;

namespace back.Tests
{
    public class SettingsControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public SettingsControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        private AppDbContext GetInMemoryDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            return new AppDbContext(options);
        }

        // Unit Test 1: Verify that GetSettings() returns NotFound when no settings record exists in the DB
        [Fact]
        public void GetSettings_ReturnsNotFound_WhenNoSettingsExist()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(GetSettings_ReturnsNotFound_WhenNoSettingsExist));

            var controller = new SettingsController(context);

            // Act
            var result = controller.GetSettings();

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Settings not found", notFoundResult.Value);
        }

        // Unit Test 2: Verify that UpdateSettings() returns Ok with updated settings when a settings record exists in the DB
        [Fact]
        public void UpdateSettings_ReturnsOk_WithUpdatedSettings_WhenSettingsExist()
        {
            // Arrange
            using var context = GetInMemoryDbContext(nameof(UpdateSettings_ReturnsOk_WithUpdatedSettings_WhenSettingsExist));

            // Assumption: The Setting model contains a SiteName property.
            var initialSetting = new Setting { OrganizationName = "OldName" };
            context.Settings.Add(initialSetting);
            context.SaveChanges();

            var controller = new SettingsController(context);

            // Assumption: The UpdateSettingDTO also contains a SiteName property.
            var updateDto = new UpdateSettingDTO { OrganizationName = "NewName" };

            // Act
            var result = controller.UpdateSettings(updateDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedSetting = Assert.IsType<Setting>(okResult.Value);

            Assert.Equal("NewName", updatedSetting.OrganizationName);
        }

        // Integration Test: Verify that PATCH /settings returns Unauthorized when no JWT token is provided.
        [Fact]
        public async Task UpdateSettings_ReturnsUnauthorized_WhenNoJWTTokenProvided()
        {
            // Arrange: create a JSON payload for updating the settings.
            // Arrange
            var client = _factory.CreateClient();

            // Create a dummy event payload.
            var newSetting = new
            {
                OrganizationName = "New Org",
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(newSetting),
                Encoding.UTF8,
                "application/json");

            // Act: send a PATCH request to /settings without an Authorization header.
            var response = await client.PatchAsync("/settings", jsonContent);

            // Assert: verify that the response status code is 401 Unauthorized.
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }
    }
}