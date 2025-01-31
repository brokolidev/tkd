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
    public class StudentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public StudentController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        /// <summary>
        /// Gets all students from the database
        /// </summary>
        /// <response code="200">A list of students</response>
        /// <response code="204">No students found in the database</response>
        /// <response code="400">Invalid page number or page size</response>
        [HttpGet]
        public async Task<IActionResult> GetStudents(int pageNumber = 1, int pageSize = 10)
        {
            // Check if pageNumber or pageSize are less than 1 and return response
            if (pageNumber <= 0 || pageSize <= 0)
                return BadRequest("Page number and page size must be greater than zero.");

            // Get all users with the "Student" role
            var allStudents = await _userManager.GetUsersInRoleAsync(UserRoles.Student.ToString());

            // If there are no students, return 204 No Content
            if (!allStudents.Any())
                return NoContent();

            // Get the students for the requested page order by ID
            var pagedStudents = PagedList<User>.Create(allStudents.OrderBy(s => s.Id), pageNumber, pageSize);

            // Create the response with page details and student data
            var response = new
            {
                pagedStudents.CurrentPage, // Current page number requested by user
                pagedStudents.PageSize, // Number of students per page
                pagedStudents.TotalItems, // Total number of students
                pagedStudents.TotalPages, // Total number of pages (by pagesize)
                Users = pagedStudents,
            };

            return Ok(response);
        }


        /// <summary>
        /// Gets one student, by the given <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The ID of the student to get</param>
        /// <response code="200">The student was found</response>
        /// <response code="204">No student matching the given id was found</response>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            // Find the student with the given ID and role "Student"
            User? student = await _context.Users
                .Where(user => user.Id == id)
                .FirstOrDefaultAsync();

            // Check if the student exists
            if (student == null)
            {
                // No student found, return 204 No Content (-1 is the defualt for id above)
                return NoContent();
            }

            // Student found, return the data with 200 OK
            return Ok(student);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterStudent(RegisterUserDTO userDTO)
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

                //give the user the student role
                IdentityResult roleResult = await _userManager.AddToRoleAsync(newUser, UserRoles.Student.ToString());

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