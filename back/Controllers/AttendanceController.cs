using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using Microsoft.AspNetCore.Identity;
using taekwondo_backend.Models.Identity;
using taekwondo_backend.Enums;
using Microsoft.EntityFrameworkCore;
using taekwondo_backend.Models;

namespace taekwondo_backend.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class AttendanceController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly UserManager<User> _userManager;
		private readonly RoleManager<Role> _roleManager;
		private readonly IConfiguration _config;

		public AttendanceController(
			AppDbContext context,
			UserManager<User> userManager,
			IConfiguration config,
			RoleManager<Role> roleManager)
		{
			_context = context;
			_userManager = userManager;
			_config = config;

			_roleManager = roleManager;
		}

		[HttpGet("{userId}")]
		public async Task<IActionResult> GetAttendanceRecords(int userId)
		{
			//check that the user exists in the system
			var user = _userManager.FindByIdAsync(userId.ToString());

			if (user == null)
			{
				return NotFound();
			}

			//the user exists in the system. proceeds with getting the attendance from the database
			var records = await _context.AttendanceRecords.Where(record => record.UserId == userId).ToListAsync();

			if (records.Count != 0)
			{
				return Ok(records);
			} else
			{
				return NoContent();
			}
		}

		[HttpPost("{userId}")]
		public async Task<IActionResult> CreateAttendanceRecord(int userId)
		{
			//check that the user exists in the system
			var user = await _userManager.FindByIdAsync(userId.ToString());

			if (user == null)
			{
				return NotFound();
			}

			//the user exists, create the record in the system
			
			//ensure the user is a student
			if ((await _userManager.GetRolesAsync(user)).FirstOrDefault() != UserRoles.Student.ToString())
			{
				return BadRequest("The user must be a student to check in.");
			}
			
			//create the record
			var record = new AttendanceRecord()
			{
				Id = 0,
				UserId = userId,
				DateRecorded = DateTime.UtcNow,
			};

			//add the record to the database, and save the changes.
			await _context.AttendanceRecords.AddAsync(record);
			await _context.SaveChangesAsync();

			//return ok
			return Created(String.Empty, new { id = record.Id });
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> DeleteAttendanceRecord(int id)
		{
			//ensure the record exists in the system before attempting to delete it
			var record = _context.AttendanceRecords.FirstOrDefault(record => record.Id == id);

			if (record == null)
			{
				return NotFound();
			}

			//record exists, delete it
			_context.AttendanceRecords.Remove(record);
			await _context.SaveChangesAsync();

			return Ok(id);
		}
	}
}