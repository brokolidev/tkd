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
		public IActionResult Get()
		{
			
			var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

			if (userId == null)
				return NotFound();
			
			// get user with user id
			var user = _userManager.FindByIdAsync(userId).GetAwaiter().GetResult();
			
			if (user == null)
				return NotFound();
			
			return Ok(new LoggedInUserDTO
			{
				Id = user.Id,
				Email = user.Email ?? string.Empty,
				DateOfBirth = user.DateOfBirth ?? DateOnly.MinValue, 
				FirstName = user.FirstName ?? string.Empty,
				LastName = user.LastName ?? string.Empty,
				BeltColor = user.BeltColor ?? BeltColorType.White,
				ProfileImage = user.ProfileImage ?? "https://i.pravatar.cc/300",
			});
		}

		// Default register route for students
		[HttpPost("register")]
		[ProducesResponseType(StatusCodes.Status201Created)]
		[ProducesResponseType(StatusCodes.Status400BadRequest)]
		public async Task<IActionResult> Register([FromBody] RegisterUserDTO userDTO)
		{
			if (ModelState.IsValid)
			{
				User newUser = new User()
				{
					UserName = userDTO.Email,
					Email = userDTO.Email,
					PasswordHash = userDTO.Password,
					FirstName = userDTO.FirstName,
					LastName = userDTO.LastName,
					DateOfBirth = userDTO.DateOfBirth,
				};

				IdentityResult Result = await _userManager.CreateAsync(newUser, userDTO.Password);
				IdentityResult RoleResult = await _userManager.AddToRoleAsync(newUser, UserRoles.Student.ToString());


				if (Result.Succeeded && RoleResult.Succeeded)
				{
					// @TODO: Implement email verification
					return CreatedAtAction("Register", new { id = newUser.Id });
				}
				return BadRequest(Result.Errors);
			}
			return BadRequest(ModelState);
		}
	}
}