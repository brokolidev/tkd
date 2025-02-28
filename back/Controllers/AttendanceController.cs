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

		[HttpGet("{userId}")]
		public async Task<IActionResult> GetAttendanceRecords(int userId)
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
				return Ok(records);
			} else
			{
				return NoContent();
			}
		}

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

			//Here, check that the user hasn't already checked into this class
			if (HasAlreadyCheckedIn(scheduleId, userId, recordTime))
			{
				return BadRequest(JsonSerializer.Serialize("The user has already checked into this class."));
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