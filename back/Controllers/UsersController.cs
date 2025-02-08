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
	public class UsersController : ControllerBase
	{
		private readonly AppDbContext _context;
		private readonly UserManager<User> _userManager;
		private readonly RoleManager<Role> _roleManager;
		private readonly IConfiguration _config;

		public UsersController(
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
		public IActionResult Get()
		{

			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

			if (userId == null)
				return NotFound();

			// get user with user id
			var user = _userManager.FindByIdAsync(userId).GetAwaiter().GetResult();
			
			if (user == null)
				return NotFound();
			
			var role = _userManager.GetRolesAsync(user).GetAwaiter().GetResult();
			
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
	}
}