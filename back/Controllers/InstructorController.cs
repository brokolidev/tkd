using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using Microsoft.AspNetCore.Identity;
using taekwondo_backend.Models.Identity;
using taekwondo_backend.Enums;

namespace taekwondo_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InstructorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public InstructorController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        /// <summary>
        /// Gets all instructors from the database
        /// </summary>
        /// <response code="200">A list of instructors</response>
        /// <response code="204">No instructors found in the database</response>
        /// <response code="400">Invalid page number or page size</response>
        [HttpGet]
        public async Task<IActionResult> GetInstructors(int pageNumber = 1, int pageSize = 10)
        {
            // Check if pageNumber or pageSize are less than 1 and return response
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest("Page number and page size must be greater than zero.");
            }

            // Get all users with the "Instructor" role
            var allInstructors = await _userManager.GetUsersInRoleAsync(UserRoles.Instructor.ToString());

            // If there are no instructors, return 204 No Content
            if (!allInstructors.Any())
            {
                return NoContent();
            }

            // Get the instructors for the requested page order by ID
            var pagedInstructors = PagedList<User>.Create(allInstructors.OrderBy(s => s.Id), pageNumber, pageSize);

            // Create the response with page details and instructor data
            var response = new
            {
                pagedInstructors.CurrentPage, // Current page number requested by user
                pagedInstructors.PageSize, // Number of instructors per page
                pagedInstructors.TotalItems, // Total number of instructors
                pagedInstructors.TotalPages, // Total number of pages (by pagesize)
                Users = pagedInstructors,
            };

            return Ok(response);
        }


        /// <summary>
        /// Gets one instructor, by the given <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The ID of the instructor to get</param>
        /// <response code="200">The instructor was found</response>
        /// <response code="204">No instructor matching the given id was found</response>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInstructorById(int id)
        {
            // Find the instructor with the given ID and role "Instructor"
            User? instructor = await _context.Users
                .Where(user => user.Id == id)
                .FirstOrDefaultAsync();

            // Check if the instructor exists
            if (instructor == null)
            {
                // No instructor found, return 204 No Content (-1 is the defualt for id above)
                return NoContent();
            }

            // Instructor found, return the data with 200 OK
            return Ok(instructor);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterInstructor(RegisterUserDTO userDTO)
        {
            if (ModelState.IsValid)
            {
                //map the user object into the user
                User newUser = new()
                {
                    UserName = userDTO.Email,
                    Email = userDTO.Email,
                    PasswordHash = userDTO.Password,
                    FirstName = userDTO.FirstName,
                    LastName = userDTO.LastName,
                    DateOfBirth = userDTO.DateOfBirth,
                };

                //create the  user
                IdentityResult userResult = await _userManager.CreateAsync(newUser, userDTO.Password);

                //give the user the instructor role
                IdentityResult roleResult = await _userManager.AddToRoleAsync(newUser, UserRoles.Instructor.ToString());

                //only return if both results were a success
                if (userResult.Succeeded && roleResult.Succeeded)
                {
                    // @TODO: Implement email verification
                    return Created(String.Empty, new { id = newUser.Id });
                }

                //something failed, return the errors
                return BadRequest(userResult.Errors);
            }
            return BadRequest(ModelState);
        }
    }
};