using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using taekwondo_backend.Models;
using taekwondo_backend.DTO;
using taekwondo_backend.Data;
/*
namespace taekwondo_backend.Controllers
{
    /// <summary>
    /// Copied from InstructorController, as they are nearly identical.
    /// 
    /// Provides endpoints for dealing with admin users
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class AdminController : ControllerBase
    {
        public readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets the number of pages needed for the admins in the database with the
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

            //get the number of admins in the system
            int adminCount = await _context.Users.Where(user => user.Role == Models.UserRoleType.Admin).CountAsync();

            //divide the total admin count by the entriesPerPage (rounding up)
            decimal pages = Math.Ceiling(((decimal)adminCount / entriesPerPage));

            return Ok(pages);
        }

        /// <summary>
        /// Gets all admins currently in the database,
        /// unless a page is set, in which case, it will return that page
        /// </summary>
        /// <param name="page"></param>
        /// <param name="entriesPerPage"></param>
        /// <response codee="200">A list of admins</response>
        /// <response code="204">No admins were found</response>
        [HttpGet("{page?}/{entriesPerPage?}")]
        public async Task<IActionResult> GetAdmins(int page = 0, int entriesPerPage = 10)
        {
            //if no page is set, this will go through and return everything
            //if a page is set, it will return the page (range of admins),
            //filled with the number of entries requested (default is 10)

            //get a list of the admins from the db
            List<UserFEDTO> admins = await _context.Users
                    .Where(user => user.Role == Models.UserRoleType.Admin)
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

            //no page defined, return all, or there are fewer admins than the entires requested
            if (page > 0 && entriesPerPage < admins.Count)
            {
                //The start index will page * entriesPerPage. if the user selects an invalid page (e.g. 5/4)
                //this should force the program to return nothing.
                int start = ((page - 1) * entriesPerPage);

                //end will be the end of the list if start is the end or the start + entriesPerPage
                //is greater or equal to count. else it will be start + entriesPerPage
                int end = start + entriesPerPage < admins.Count
                    ? start + entriesPerPage
                    : start > admins.Count
                        ? start
                        : admins.Count - 1; //end of the list

                //the page is defined, and there are more admins than entries requested
                try
                {
                    //try to pull out the page
                    admins = admins[start..end];
                }
                catch (ArgumentException)
                {
                    //the page was out of bounds, return an empty list
                    admins = [];
                }
            }

            //check that the list is populated
            if (admins.Count == 0)
            {
                //return not found, as there were no admins in the db
                return NoContent();
            }


            //the list is retrieved, return.
            return Ok(admins);

        }


        /// <summary>
        /// Gets one admin, by the given <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The id of the admin to get</param>
        /// <response code="200">The admin found</response>
        /// <response code="404">No admin matching the given id was found</response>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAdmin(int id)
        {
            UserFEDTO? admin = await _context.Users
                .Where(user => user.Role == Models.UserRoleType.Admin && user.Id == id)
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

            //check that the admin is good
            if (admin == null)
            {
                //admin wasn't found, as it is assumed to be there by passing in the id
                //return 404
                return NotFound(new[] { "Admin with id " + id + " could not be found." });
            }

            //admin was found, return it.
            return Ok(admin);
        }


        /// <summary>
        /// Creates an admin user object.
        /// </summary>
        /// <param name="admin">The admin to create</param>
        /// <response code="200">Returns the id of the new admin</response>
        /// <response code="400">The admin contained invalid data</response>
        [HttpPost]
        public async Task<IActionResult> CreateAdmin(UserCreationDTO admin)
        {
            //ensure the data being passed into the endpoint is valid
            List<string> errors = ValidateAdmin(admin);

            //if any errors were detected, return with a bad request (code 400)
            if (errors.Count > 0)
            {
                //return 400 with the list of errors
                return BadRequest(errors);
            }

            //no errors, proceeding to create the new user
            User newUser = new(
                0, //temp id
                Models.UserRoleType.Admin, //type needs to be admin
                admin.FirstName,
                admin.LastName,
                admin.Email,
                admin.BirthDate,
                admin.BeltColor
            );

            //add the new user to the database.
            _context.Users.Add(newUser);

            //save the changes made.
            await _context.SaveChangesAsync();

            //creation went ok, return response ok (200) to the user
            return Ok(newUser.Id);
        }


        /// <summary>
        /// Updates the admin belonging to the given <paramref name="id"/> with the 
        /// values in the <paramref name="updatedAdmin"/>.
        /// </summary>
        /// <param name="id">The id of the admin to update</param>
        /// <param name="updatedAdmin">The values to update the admin with</param>
        /// <response code="200">The id of the isntructor updated</response>
        /// <response code="400">The values provided in the updatedAdmin were invalid</response>
        /// <response code="404">An admin matching the given id could not be found</response>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAdmin(int id, UserCreationDTO updatedAdmin)
        {
            //validate the updated admin coming in
            List<string> errors = ValidateAdmin(updatedAdmin);

            //if the admin is invalid, return 400
            if (errors.Count > 0)
            {
                //return the list of errors as well
                return BadRequest(errors);
            }

            //admin is valid, attempt the update.

            //attempt to find the admin that was requested to be updated
            User? adminFound = _context.Users.Find(id);

            //if the admin could not be found, return with a code of 404
            if (adminFound == null)
            {
                //The user is expected to be here (the id for this user was called) return 404
                return NotFound(new[] { "Admin with id " + id + " could not be found." });
            }


            //mapping the DTO to the User object found above
            adminFound.FirstName = updatedAdmin.FirstName;
            adminFound.LastName = updatedAdmin.LastName;
            adminFound.Email = updatedAdmin.Email;
            adminFound.BirthDate = updatedAdmin.BirthDate;

            //update The admin object
            _context.Update(adminFound);

            //save the changes made to the database
            await _context.SaveChangesAsync();

            //return with a code of 200, and the id of the admin that was updated
            return Ok(id);
        }


        /// <summary>
        /// Validates an admin object before adding it to the database
        /// </summary>
        /// <param name="admin">The admin object to validate</param>
        /// <returns>A list of the errors that were encountered in the user object</returns>
        private List<string> ValidateAdmin(UserCreationDTO admin)
        {
            List<string> errors = [];

            //ensure the firstname is not empty
            if (admin.FirstName == String.Empty)
            {
                errors.Add("The first name must not be empty");
            }

            //ensure the lastname is not empty
            if (admin.LastName == String.Empty)
            {
                errors.Add("The last name must not be empty");
            }

            //solution found here:
            //https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
            try
            {
                //throwaway variable. The object isn't needed, the exception is really what
                //we're looking for here
                _ = new MailAddress(admin.Email).Address;
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