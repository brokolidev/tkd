using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using Microsoft.AspNetCore.Identity;
using taekwondo_backend.Models.Identity;
using taekwondo_backend.Enums;
using Microsoft.AspNetCore.Authorization;


namespace taekwondo_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;
        
        public StudentsController(AppDbContext context, UserManager<User> userManager)
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
        [Authorize]
        public async Task<IActionResult> GetStudents(int pageNumber = 1, int pageSize = 10)
        {
            // Check if pageNumber or pageSize are less than 1 and return response
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest("Page number and page size must be greater than zero.");
            }

            // Get all users with the "Student" role
            var allStudents = (await _userManager.GetUsersInRoleAsync(UserRoles.Student.ToString()))
                .Select(user => new UserFEDTO
                    {
                        Id = user.Id,
                        FirstName = user.FirstName ?? "",
                        LastName = user.LastName ?? "",
                        DateOfBirth = user.DateOfBirth,
                        Email = user.Email ?? "",
                        BeltColor = user.BeltColor,
                        Role = UserRoles.Student,
                        ProfileImage = user.ProfileImage ?? "https://i.pravatar.cc/300",
                    }
                );

            // If there are no students, return 204 No Content
            if (!allStudents.Any())
            {
                return NoContent();
            }

            // Get the students for the requested page order by ID
            var pagedStudents = PagedList<UserFEDTO>.Create(allStudents, pageNumber, pageSize);

            return Ok(pagedStudents);
        }


        /// <summary>
        /// Gets one student, by the given <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The ID of the student to get</param>
        /// <response code="200">The student was found</response>
        /// <response code="204">No student matching the given id was found</response>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetStudentById(int id)
        {
            // Find the student with the given ID and role "Student"
            User? student = await _userManager.FindByIdAsync(id.ToString());

            // Check if the student exists
            if (student == null)
            {
                // No student found, return 204 No Content (-1 is the defualt for id above)
                return NoContent();
            }

            //map the user to a UserFEDTO
            UserFEDTO user = new()
            {
                Id = id,
                FirstName = student.FirstName ?? "",
                LastName = student.LastName ?? "",
                Email = student.Email ?? "",
                BeltColor = student.BeltColor,
                DateOfBirth = student.DateOfBirth,
                Role = UserRoles.Student,
                ProfileImage = student.ProfileImage ?? ""
            };

            // Student found, return the data with 200 OK
            return Ok(user);
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
                    BeltColor = userDTO.BeltColor,
                    ProfileImage = userDTO.ProfileImage ?? ""
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