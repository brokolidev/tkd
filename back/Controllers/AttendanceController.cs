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
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Text.Json;
using System;
using taekwondo_backend.Services;
using System.IdentityModel.Tokens.Jwt;

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

        [Authorize]
        [HttpGet("{userId}")]
		public async Task<IActionResult> GetAttendanceRecords(int userId, int pageNumber = 1, int pageSize = 10)
		{
			//check that the user exists in the system
			var user = await _userManager.FindByIdAsync(userId.ToString());

			if (user == null)
			{
				return NotFound();
			}

			//the user exists in the system. proceeds with getting the attendance from the database
			var records = await _context.AttendanceRecords.Where(record => record.UserId == userId).ToListAsync();

			if (records.Count != 0)
			{
				//convert the Records to FEDTOs, to pass the user and schedule back to the FE
				var recordsForFE = await Task.WhenAll(records.Select(async record => new AttendanceRecordFEDTO()
				{
					Id = record.Id,
					User = (await _userManager.FindByIdAsync(record.UserId.ToString()) ?? new Models.Identity.User()),
					Schedule = (_context.Schedules.FirstOrDefault(schedule => schedule.Id == record.ScheduleId) ?? new Schedule()),
					DateRecorded = record.DateRecorded
				}));

				//finally, paginate the list
                var pagedRecords = PagedList<AttendanceRecordFEDTO>.Create(recordsForFE, pageNumber, pageSize);

                return Ok(pagedRecords);
			} else
			{
				return NoContent();
			}
		}

		[HttpGet("qr/{token}")]
		public async Task<IActionResult> CreateAttendanceRecordFromQR(string token)
		{
			//generate the dateTime
			DateTime recordTime = DateTime.UtcNow;

			//decode & validate the JWT, then pass the id and time off to the create attendance record
			JwtSecurityToken? decodedToken = JwtService.DecodeJwt(token);

			//if the token could not be read, return an error
			if (decodedToken == null)
			{
				return Content("<html><body><h1>ERROR</h1><p>The token inputted could not be parsed.</p></body></html>", "text/html");
			}

			//if the token has expired, return an error
			if ((decodedToken.ValidTo.Kind == DateTimeKind.Utc ? decodedToken.ValidTo : decodedToken.ValidTo.ToUniversalTime()) < recordTime)
			{
				return Content("<html><body><h1>ERROR</h1><p>The token inputted has expired. Refresh the token and try again</p></body></html>", "text/html");
			}

			Claim? idClaim = decodedToken.Claims.FirstOrDefault(claim => claim.Type.ToLower() == "userid");

			//if the id claim was not found, return an error
			if (idClaim == null)
			{
				return Content("<html><body><h1>ERROR</h1><p>The token inputted does not contain an ID claim.</p></body></html>", "text/html");
			}

            bool parseSuccess = Int32.TryParse(idClaim.Value, out int userId);

			//if the parse failed return an error
			if (!parseSuccess)
			{
				return Content("<html><body><h1>ERROR</h1><p>The id inputted could not be parsed.</p></body></html>", "text/html");
			}

			recordTime = new DateTime(2025, 3, 3, 10, 51, 0);

			//the id should be parsed now, send the date and id off to the other method to add the record
			IActionResult result = await CreateAttendanceRecord(userId, recordTime);

			//alert the user that the record creation was a success if the result was good
			if (result is OkObjectResult)
			{
				//this will eventually return the attendance record id
				string htmlContent = "<html><body><h1>Attendance Recorded</h1><p>Your attendance has been successfully marked.</p></body></html>";
				return Content(htmlContent, "text/html");
			} else
			{
				return Content("<html><body><h1>ERROR</h1><p>The attendance record failed to be created.</p></body></html>", "text/html");
			}

        }

        [Authorize]
        [HttpPost("{userId}")]
		public async Task<IActionResult> CreateAttendanceRecord(int userId, DateTime recordTime)
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

			//attempt to find the schedule that this is for.
			int scheduleId = await GetScheduleId(user, recordTime);
			
			//if scheduleId is null, then that means that the date inputted wasn't close to one of the user's schedules.
			if (scheduleId == -1)
			{
				return BadRequest(JsonSerializer.Serialize("The Time inputted was not within a half an hour of a schedule start time for the user"));
			}

			//if the schedule cannot be found in the HasAlreadyCheckedIn method, it throws an exception. catch it here and return.
			try
			{
				//Here, check that the user hasn't already checked into this class
				if (HasAlreadyCheckedIn(scheduleId, userId, recordTime))
				{
					return BadRequest(JsonSerializer.Serialize("The user has already checked into this class."));
				}
			} catch (InvalidOperationException ex)
			{
				//return a not found. the schedule was not found in the database.
				//realistically, this should never run. if the schedule doesn't exist, it should be caught earlier in the
				//program. this is just to make c# happy
				return NotFound(JsonSerializer.Serialize(ex.Message));
			}

			//create the record
			var record = new AttendanceRecord()
			{
				Id = 0,
				UserId = userId,
				//the above type is nullable, but it will never be null here
				ScheduleId = scheduleId,
				DateRecorded = recordTime,
			};

            //created with help from: https://chatgpt.com/share/67c14ff1-3378-800c-ac35-d0e1738c8c0a
            //ensure all dates are formatted properly
            record.DateRecorded = record.DateRecorded.Kind == DateTimeKind.Utc ? record.DateRecorded : record.DateRecorded.ToUniversalTime();

			//add the record to the database, and save the changes.
			await _context.AttendanceRecords.AddAsync(record);
			await _context.SaveChangesAsync();

			//return ok
			return Created(String.Empty, new { id = record.Id });
		}

        [Authorize]
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
	

		private async Task<int> GetScheduleId(Models.Identity.User user, DateTime timeOfRecord)
		{
			DateTime localRecordTime = timeOfRecord.Kind == DateTimeKind.Utc ? timeOfRecord.ToLocalTime() : timeOfRecord;

			TimeOnly timeOnlyOfRecord = new(localRecordTime.Hour, localRecordTime.Minute, localRecordTime.Second);
			DayOfWeek dayOfWeek = timeOfRecord.DayOfWeek;

            //created with help from: https://chatgpt.com/share/67c14ff1-3378-800c-ac35-d0e1738c8c0a
            //get the list of scheules from the user
            //they will be ordered by the timeslot's start time, to make the next step easier
            var schedules = await _context.Schedules
				.Where(schedule => schedule.Students.Contains(user))
				.Include(schedule => schedule.TimeSlot)
				.OrderBy(schedule => schedule.TimeSlot.StartsAt)
				.ToListAsync();

            //created with help from: https://chatgpt.com/share/67c14ff1-3378-800c-ac35-d0e1738c8c0a
            //take the list, and find the schedule that matches closest to the schedule
            //this checks if the user has checked in within a half hour of any of their schedules, and pulls out the closest one.
            int? scheduleId = schedules.FirstOrDefault(schedule =>
			{

				double difference = 0;

                //depending on if the time is before or after the start time, the subtraction needs to be flipped.
                if (timeOnlyOfRecord < schedule.TimeSlot.StartsAt)
				{
					//the start time is after the recorded time, so timeslot time first
					difference = Math.Abs((schedule.TimeSlot.StartsAt - timeOnlyOfRecord).TotalMinutes);
                } else
				{
					//the start time is before the recorded time, so timeslot time last
					difference = Math.Abs((timeOnlyOfRecord - schedule.TimeSlot.StartsAt).TotalMinutes);
                }

				if (difference < 30 && schedule.Day == dayOfWeek)
				{
					return true;
				}

				return false;
            })?.Id;

			return (scheduleId ?? -1);
		}
	
		private bool HasAlreadyCheckedIn(int scheduleId, int UserId, DateTime recordTime)
		{
			bool hasCheckedIn = false;

			//convert to local time
            DateTime localRecordTime = recordTime.Kind == DateTimeKind.Utc ? recordTime.ToLocalTime() : recordTime;

            //first, pull out the record that belong to this user and schedule
            var records = _context.AttendanceRecords
				.Where(record => record.UserId == UserId && record.ScheduleId == scheduleId)
				.Where(record => record.DateRecorded.Year == localRecordTime.Year &&
					record.DateRecorded.Month == localRecordTime.Month &&
					record.DateRecorded.Day == localRecordTime.Day);

			//check if there are any. If so, continue on.
			if (records.Any())
			{
                //exception determined from here: https://chatgpt.com/share/67c1dc7c-2dc8-800c-ba64-fa7668c05b8b
                //pull out the schedule. it will be needed here
                var schedule = _context.Schedules.FirstOrDefault(schedule => schedule.Id == scheduleId) 
					?? throw new InvalidOperationException("The schedule could not be found in the database");

                //now, check the time of each record

                foreach ( var record in records )
				{
                    double difference = 0;

					//convert to local timeOnly
                    DateTime curRecordLocalTime = record.DateRecorded.Kind == DateTimeKind.Utc ? record.DateRecorded.ToLocalTime() : record.DateRecorded;
                    TimeOnly recordTimeOnly = new(curRecordLocalTime.Hour, curRecordLocalTime.Minute, curRecordLocalTime.Second);

					//depending on if the time is before or after the start time, the subtraction needs to be flipped.
                    if (recordTimeOnly < schedule.TimeSlot.StartsAt)
                    {
						//the start time is after the recorded time, so timeslot time first
                        difference = Math.Abs((schedule.TimeSlot.StartsAt - recordTimeOnly).TotalMinutes);
                    }
                    else
                    {
						//the start time is before the recorded time, so timeslot time last
                        difference = Math.Abs((recordTimeOnly - schedule.TimeSlot.StartsAt).TotalMinutes);
                    }

					//if it was in the checkin time, set hasCheckedIn to true
                    if (difference < 30)
                    {
                        hasCheckedIn = true;

						//break out of the loop, it's not needed anymore.
						break;
                    }
                }
			}

			return hasCheckedIn;
		}
	}
}