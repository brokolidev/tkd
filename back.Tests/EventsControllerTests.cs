using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Diagnostics;
using taekwondo_backend.Controllers;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using taekwondo_backend.Models;

namespace back.Tests
{
    public class EventsControllerTests
    {
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