using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using System.Net;
using System.Text;
using taekwondo_backend;
using taekwondo_backend.Controllers;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using taekwondo_backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;

namespace back.Tests
{
    public class EventsControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public EventsControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task CreateEvent_AccessDenied_ForNonAdminRole()
        {
            // Arrange
            // We override the authentication service so that any request using the "Test" scheme gets a 
            // ClaimsPrincipal with the "User" role rather than "Admin" or "Instructor".
            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    services.AddAuthentication("Test")
                        .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", options => { });
                });
            }).CreateClient();

            // This header drives our test authentication handler.
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");

            // Create a dummy event payload.
            var newEvent = new
            {
                Title = "Unauthorized Event",
                StartsAt = DateTime.UtcNow,
                EndsAt = DateTime.UtcNow.AddHours(1),
                Description = "This event should not be created"
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(newEvent),
                Encoding.UTF8,
                "application/json");

            // Act: attempt to create a new event.
            var response = await client.PostAsync("/events", jsonContent);

            // Assert: the response should be 403 Forbidden
            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task CreateEvent_Success_ForAdminRole()
        {
            // Arrange
            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    services.AddAuthentication("TestAdmin")
                        .AddScheme<AuthenticationSchemeOptions, TestAdminAuthHandler>("TestAdmin", options => { });
                });
            }).CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("TestAdmin");

            var newEvent = new
            {
                Title = "Authorized Event",
                StartsAt = DateTime.UtcNow,
                EndsAt = DateTime.UtcNow.AddHours(1),
                Description = "This event should be created"
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(newEvent),
                Encoding.UTF8,
                "application/json");

            // Act
            var response = await client.PostAsync("/events", jsonContent);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            // Optionally, you can deserialize the response and assert its properties:
            // string responseContent = await response.Content.ReadAsStringAsync();
            // Assert.Contains("Authorized Event", responseContent);
        }

        [Fact]
        public async Task CreateEvent_Fails_WhenStartsAtNotProvided()
        {
            // Arrange
            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    services.AddAuthentication("TestAdmin")
                        .AddScheme<AuthenticationSchemeOptions, TestAdminAuthHandler>("TestAdmin", options => { });
                });
            }).CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("TestAdmin");

            // Payload without the "StartsAt" property.
            var newEventWithoutStartsAt = new
            {
                Title = "Event Without Start Time",
                // Missing: StartsAt
                EndsAt = DateTime.UtcNow.AddHours(1),
                Description = "This event should fail creation because 'StartsAt' is missing."
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(newEventWithoutStartsAt),
                Encoding.UTF8,
                "application/json");

            // Act
            var response = await client.PostAsync("/events", jsonContent);

            // Assert: Expect a 400 Bad Request due to model validation error.
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreateEvent_Fails_WhenEndsAtNotProvided()
        {
            // Arrange
            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    services.AddAuthentication("TestAdmin")
                        .AddScheme<AuthenticationSchemeOptions, TestAdminAuthHandler>("TestAdmin", options => { });
                });
            }).CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("TestAdmin");

            // Construct a payload missing the "EndsAt" property.
            var newEventMissingEndsAt = new
            {
                Title = "Event Without End Time",
                StartsAt = DateTime.UtcNow,
                // EndsAt is intentionally omitted
                Description = "This event should fail creation because 'EndsAt' is missing."
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(newEventMissingEndsAt),
                Encoding.UTF8,
                "application/json");

            // Act
            var response = await client.PostAsync("/events", jsonContent);

            // Assert: Verify the response is 400 Bad Request.
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreateEvent_Fails_WhenDescriptionNotProvided()
        {
            // Arrange
            var client = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    services.AddAuthentication("TestAdmin")
                        .AddScheme<AuthenticationSchemeOptions, TestAdminAuthHandler>("TestAdmin", options => { });
                });
            }).CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("TestAdmin");

            // Construct a payload missing the "Description" property.
            var newEventMissingDescription = new
            {
                Title = "Event Without Description",
                StartsAt = DateTime.UtcNow,
                EndsAt = DateTime.UtcNow.AddHours(1)
                // "Description" is intentionally omitted.
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(newEventMissingDescription),
                Encoding.UTF8,
                "application/json");

            // Act
            var response = await client.PostAsync("/events", jsonContent);

            // Assert: Expect a 400 Bad Request due to model validation failure.
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        // This test authentication handler simulates a JWT token with a user that is 
        // authenticated but does _not_ have the required role ("Admin" or "Instructor").
        public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
        {
            public TestAuthHandler(
                IOptionsMonitor<AuthenticationSchemeOptions> options,
                ILoggerFactory logger,
                UrlEncoder encoder,
                ISystemClock clock)
                : base(options, logger, encoder, clock) { }

            protected override Task<AuthenticateResult> HandleAuthenticateAsync()
            {
                // Here we set up the claims for a non-authorized user.
                var claims = new[]
                {
                new Claim(ClaimTypes.NameIdentifier, "123"),
                // The controller only allows "Admin" or "Instructor"; we return a "User" role.
                new Claim(ClaimTypes.Role, "User")
            };

                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);

                return Task.FromResult(AuthenticateResult.Success(ticket));
            }
        }

        // Authentication handler for authorized user (Admin role).
        public class TestAdminAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
        {
            public TestAdminAuthHandler(
                IOptionsMonitor<AuthenticationSchemeOptions> options,
                ILoggerFactory logger,
                UrlEncoder encoder,
                ISystemClock clock)
                : base(options, logger, encoder, clock) { }

            protected override Task<AuthenticateResult> HandleAuthenticateAsync()
            {
                var claims = new[]
                {
                new Claim(ClaimTypes.NameIdentifier, "123"),
                // Here the role "Admin" is provided to allow event creation.
                new Claim(ClaimTypes.Role, "Admin")
            };

                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);

                return Task.FromResult(AuthenticateResult.Success(ticket));
            }
        }

        [Fact]
        public void Get_ReturnsEventList()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "Test")
                .Options;

            using(var context = new AppDbContext(options))
            {
                context.Events.Add(new Event
                {
                    User = new taekwondo_backend.Models.Identity.User(),
                    Title = "event",
                    StartsAt = new DateTime(2025, 01, 02),
                    EndsAt = new DateTime(2025, 01, 03),
                    Description = "event description",
                    IsOpen = true,
                });
                context.SaveChanges();
            }


            // Act
            using (var context = new AppDbContext(options))
            {
                var controller = new EventsController(context);
                ActionResult<IEnumerable<Event>> actionResult = controller.GetEvents();

                var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);

                var events = Assert.IsAssignableFrom<PagedList<GetEventsDTO>>(okResult.Value);

                Assert.Single(events.Data);
            }
        }
    }
}