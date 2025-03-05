using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
using Microsoft.AspNetCore.Identity;
using taekwondo_backend.Models.Identity;
using taekwondo_backend.Enums;
using Microsoft.AspNetCore.Authorization;
using QRCoder;
using taekwondo_backend.Services;
using System.Reflection.Emit;
using System.Text.Json;


namespace taekwondo_backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly JwtService _jwtService;
        private readonly IConfiguration _config;
        
        public StudentsController(AppDbContext context, UserManager<User> userManager, JwtService jwtService, IConfiguration config)
        {
            _context = context;
            _userManager = userManager;
            _jwtService = jwtService;
            _config = config;
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

        [HttpGet("{id}/qr")]
        public IActionResult GetUserQR(int id)
        {
            //qr code generation adapted from: https://github.com/codebude/QRCoder/wiki/

            //so this here is going to have to build a qr code and return it to the user
            QRCodeGenerator qRCodeGenerator = new();

            //generate a new qr code token
            string idToken = _jwtService.GenerateTokenForQR(id);

            //get the url to the page on the frontend
            string url = "/attendance/new_record?user=" + idToken;

            //pull out the host from appsettings
            string? host = _config.GetValue<string>("FEHost");

            //if the host could not be found, return status code 500
            if (host == null)
            {
                return StatusCode(500, new { message = "The frontend host could not be determined" });
            }

            //generate the QR code
            PayloadGenerator.Url payloadUrl = new(host + url);
            QRCodeData qrCodeData = qRCodeGenerator.CreateQrCode(payloadUrl, QRCodeGenerator.ECCLevel.Q);
            Base64QRCode qrCode = new(qrCodeData);

            //return the QR code
            return Ok(qrCode.GetGraphic(20));
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