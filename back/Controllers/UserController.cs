using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using Microsoft.AspNetCore.Identity;
using taekwondo_backend.Models.Identity;
using taekwondo_backend.Enums;

namespace taekwondo_backend.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class UserController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly UserManager<User> _userManager;
		private readonly RoleManager<Role> _roleManager;
		private readonly IConfiguration _config;

		public UserController(
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

		[HttpGet]
		[Authorize]
		public async Task<IActionResult> Get()
		{

			//attempt to pull out the user id from the user claims
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

			//if the user id cannot be found return not null
			if (userId == null)
			{
				return NotFound();
			}

			// get user with user id
			var user = await _userManager.FindByIdAsync(userId);

			//If the user doesn't exist, return not found
			if (user == null)
			{
				return NotFound();
			}

			var role = await _userManager.GetRolesAsync(user);

			return Ok(new LoggedInUserDTO
			{
				Id = user.Id,
				Email = user.Email ?? string.Empty,
				DateOfBirth = user.DateOfBirth ?? DateOnly.MinValue,
				FirstName = user.FirstName ?? string.Empty,
				LastName = user.LastName ?? string.Empty,
				BeltColor = user.BeltColor ?? BeltColorType.White,
				ProfileImage = user.ProfileImage ?? "https://i.pravatar.cc/300",
				Role = role.FirstOrDefault() ?? string.Empty,
			});
		}

		[HttpGet]
		[Route("counts")]
		[Authorize]
		public IActionResult GetCounts()
		{
			var studentCount = _userManager.GetUsersInRoleAsync(UserRoles.Student.ToString()).Result.Count;
			var instructorCount = _userManager.GetUsersInRoleAsync(UserRoles.Instructor.ToString()).Result.Count;
			var counts = new List<int> { studentCount, instructorCount };

			return Ok(counts);
		}

		[HttpDelete("{id:int}")]
		[Authorize]
		public async Task<IActionResult> DeleteUser(int id)
		{
			if (id < 0)
			{
				return BadRequest("The id cannot be negative.");
			}

			//check if the user exists in the system
			var user = await _userManager.FindByIdAsync(id.ToString());

			//return if the user could not be found
			if (user == null)
			{
				return NotFound();
			}

			//the user was found in the system, delete.
			var result = await _userManager.DeleteAsync(user);

			//check if the result succeeded. if it didn't, then something has gone wrong in the server.
			if (!result.Succeeded)
			{
				//the result didn't succeed, send back an error
				return StatusCode(500, new { errors = result.Errors });
			} else
			{
				//result was good, return Ok
				return Ok(id);
			}
		}
	}
}