using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using taekwondo_backend.Controllers;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using taekwondo_backend.Models.Identity;
using taekwondo_backend.Models;

namespace back.Tests
{
    public class SchedulesControllerUnitTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly SchedulesController _controller;

        public SchedulesControllerUnitTests()
        {
            // Create a new in-memory database for each test to ensure isolation.
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _controller = new SchedulesController(_context);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
