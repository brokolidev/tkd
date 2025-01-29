using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using taekwondo_backend.Models;
using taekwondo_backend.Data;
using taekwondo_backend.DTO;
/*
namespace taekwondo_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InstructorController : ControllerBase
    {
        public readonly AppDbContext _context;

        public InstructorController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets the number of pages needed for the instructors in the database with the
        /// given <paramref name="entriesPerPage"/>
        /// </summary>
        /// <param name="entriesPerPage">The number of entries to put on a given page</param>
        /// <response code="200">The number of pages needed</response>
        /// <response code="400">The entries per page requested was less than or equal to 0</response>
        [HttpGet("pages/{entriesPerPage?}")]
        public async Task<IActionResult> GetPagesForEntries(int entriesPerPage = 10)
        {
            if (entriesPerPage <= 0)
            {
                return BadRequest(new[] { "The entries per page must be an integer greater than 0." });
            }

            //get the number of instructors in the system
            int instructorCount = await _context.Users.Where(user => user.Role == Models.UserRoleType.Instructor).CountAsync();

            //divide the total instructor count by the entriesPerPage (rounding up)
            decimal pages = Math.Ceiling(((decimal)instructorCount / entriesPerPage));

            return Ok(pages);
        }

        /// <summary>
        /// Gets all instructors currently in the database,
        /// unless a page is set, in which case, it will return that page
        /// </summary>
        /// <param name="page"></param>
        /// <param name="entriesPerPage"></param>
        /// <response codee="200">A list of instructors</response>
        /// <response code="204">No instructors were found</response>
        [HttpGet("{page?}/{entriesPerPage?}")]
        public async Task<IActionResult> GetInstructors(int page = 0, int entriesPerPage = 10)
        {
            //if no page is set, this will go through and return everything
            //if a page is set, it will return the page (range of instructors),
            //filled with the number of entries requested (default is 10)

            //get a list of the instructors from the db
            List<UserFEDTO> instructors = await _context.Users
                    // .Where(user => user.Role == Models.UserRoleType.Instructor)
                    //convert the User objects into UserFEDTOs which hides the password
                    //from the frontend.
                    //The select statement is essentially a ForEach loop within the query
                    .Select(user => new UserFEDTO(
                        user.Id,
                        user.Role,
                        user.FirstName,
                        user.LastName,
                        user.Email,
                        user.BirthDate,
                        user.BeltColor
                    ))
                    //collection initializer can't run with async, so this is needed
                    .ToListAsync();

            //no page defined, return all, or there are fewer instructors than the entires requested
            if (page > 0 && entriesPerPage < instructors.Count)
            {
                //The start index will page * entriesPerPage. if the user selects an invalid page (e.g. 5/4)
                //this should force the program to return nothing.
                int start = ((page - 1) * entriesPerPage);

                //end will be the end of the list if start is the end or the start + entriesPerPage
                //is greater or equal to count. else it will be start + entriesPerPage
                int end = start + entriesPerPage < instructors.Count
                    ? start + entriesPerPage
                    : start > instructors.Count 
                        ? start
                        : instructors.Count - 1; //end of the list

                //the page is defined, and there are more instructors than entries requested
                try
                {
                    //try to pull out the page
                    instructors = instructors[start .. end];
                } catch (ArgumentException)
                {
                    //the page was out of bounds, return an empty list
                    instructors = [];
                }
            }

            //check that the list is populated
            if (instructors.Count == 0)
            {
                //return not found, as there were no instructors in the db
                return NoContent();
            }


            //the list is retrieved, return.
            return Ok(instructors);

        }


        /// <summary>
        /// Gets one instructor, by the given <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The id of the instructor to get</param>
        /// <response code="200">The instructor found</response>
        /// <response code="404">No instructor matching the given id was found</response>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInstructor(int id)
        {
            UserFEDTO? instructor = await _context.Users
                .Where(user => user.Role == Models.UserRoleType.Instructor && user.Id == id)
                //convert the User objects into UserFEDTOs which hides the password
                //from the frontend.
                //The select statement is essentially a ForEach loop within the query
                .Select(user => new UserFEDTO(
                    user.Id,
                    user.Role,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.BirthDate,
                    user.BeltColor
                ))
                .FirstOrDefaultAsync();

            //check that the instructor is good
            if (instructor == null)
            {
                //instructor wasn't found, as it is assumed to be there by passing in the id
                //return 404
                return NotFound(new[] { "Instructor with id " + id + " could not be found." });
            }

            //instructor was found, return it.
            return Ok(instructor);
        }


        /// <summary>
        /// Creates an instructor user object.
        /// </summary>
        /// <param name="instructor">The instructor to create</param>
        /// <response code="200">Returns the id of the new instructor</response>
        /// <response code="400">The instructor contained invalid data</response>
        [HttpPost]
        public async Task<IActionResult> CreateInstructor(UserCreationDTO instructor)
        {
            //ensure the data being passed into the endpoint is valid
            List<string> errors = ValidateInstructor(instructor);

            //if any errors were detected, return with a bad request (code 400)
            if (errors.Count > 0)
            {
                //return 400 with the list of errors
                return BadRequest(errors);
            }

            //no errors, proceeding to create the new user
            User newUser = new(
                0, //temp id
                Models.UserRoleType.Instructor, //type needs to be instructor
                instructor.FirstName,
                instructor.LastName,
                instructor.Email,
                instructor.BirthDate,
                instructor.BeltColor
            );

            //add the new user to the database.
            _context.Users.Add(newUser);

            //save the changes made.
            await _context.SaveChangesAsync();

            //creation went ok, return response ok (200) to the user
            return Ok(newUser.Id);
        }


        /// <summary>
        /// Updates the instructor belonging to the given <paramref name="id"/> with the 
        /// values in the <paramref name="updatedInstructor"/>.
        /// </summary>
        /// <param name="id">The id of the instructor to update</param>
        /// <param name="updatedInstructor">The values to update the instructor with</param>
        /// <response code="200">The id of the isntructor updated</response>
        /// <response code="400">The values provided in the updatedInstructor were invalid</response>
        /// <response code="404">An instructor matching the given id could not be found</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInstructor(int id, UserCreationDTO updatedInstructor)
        {
            //validate the updated instructor coming in
            List<string> errors = ValidateInstructor(updatedInstructor);

            //if the instructor is invalid, return 400
            if (errors.Count > 0)
            {
                //return the list of errors as well
                return BadRequest(errors);
            }

            //instructor is valid, attempt the update.

            //attempt to find the instructor that was requested to be updated
            User? instructorFound = _context.Users.Find(id);

            //if the instructor could not be found, return with a code of 404
            if (instructorFound == null)
            {
                //The user is expected to be here (the id for this user was called) return 404
                return NotFound(new[] { "Instructor with id " + id + " could not be found." });
            }

            
            //mapping the DTO to the User object found above
            instructorFound.FirstName = updatedInstructor.FirstName;
            instructorFound.LastName = updatedInstructor.LastName;
            instructorFound.Email = updatedInstructor.Email;
            instructorFound.BirthDate = updatedInstructor.BirthDate;

            //update The instructor object
            _context.Update(instructorFound);

            //save the changes made to the database
            await _context.SaveChangesAsync();

            //return with a code of 200, and the id of the instructor that was updated
            return Ok(id);
        }


        /// <summary>
        /// Validates an instructor object before adding it to the database
        /// </summary>
        /// <param name="instructor">The instructor object to validate</param>
        /// <returns>A list of the errors that were encountered in the user object</returns>
        private List<string> ValidateInstructor(UserCreationDTO instructor)
        {
            List<string> errors = [];

            //ensure the firstname is not empty
            if (instructor.FirstName == String.Empty)
            {
                errors.Add("The first name must not be empty");
            }

            //ensure the lastname is not empty
            if (instructor.LastName == String.Empty)
            {
                errors.Add("The last name must not be empty");
            }

            //solution found here:
            //https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
            try
            {
                //throwaway variable. The object isn't needed, the exception is really what
                //we're looking for here
                _ = new MailAddress(instructor.Email).Address;
            }
            catch (Exception)
            {
                errors.Add("The email address inputted is invalid.");
            }

            return errors;
        }
    }
}
*/