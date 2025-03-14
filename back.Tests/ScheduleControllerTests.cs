using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using taekwondo_backend;
using Microsoft.AspNetCore.TestHost;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using static back.Tests.EventsControllerTests;
using Microsoft.AspNetCore.Authentication;
using System.Text.Json;
using taekwondo_backend.Data;
using taekwondo_backend.Models;
using taekwondo_backend.Models.Identity;

namespace back.Tests
{
    public class ScheduleControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public ScheduleControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task UpdateSchedule_ReturnsOK_WhenAdminAttempts()
        {
            // Arrange
            using (var scope = _factory.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Remove any existing schedule with ID 1 for a clean state.
                var existingSchedule = context.Schedules.FirstOrDefault(s => s.Id == 1);
                if (existingSchedule != null)
                {
                    context.Schedules.Remove(existingSchedule);
                    context.SaveChanges();
                }

                // Add a new schedule entry with ID 1. Adjust property values as needed.
                context.Schedules.Add(new Schedule
                {
                    Id = 1,
                    TimeSlot = new TimeSlot(),                  // Assuming default constructor exists for dummy data.
                    Students = new List<User>(),                // An empty list is acceptable if no students yet.
                    Instructors = new List<User>(),             // An empty list for instructors.
                    Day = DayOfWeek.Monday,                     // Example day.
                    Level = "Beginner Class",                   // Default level.
                    IsOpen = true,                              // Initial state is open.
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
                context.SaveChanges();
            }

            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    services.AddAuthentication("Admin")
                        .AddScheme<AuthenticationSchemeOptions, TestAdminAuthHandler>("Admin", options => { });
                });
            }).CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Admin");

            var updateSchedule = new
            {
                isOpen = false,
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(updateSchedule),
                Encoding.UTF8,
                "application/json");

            // Act
            var response = await client.PatchAsync("/schedules/1", jsonContent);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
