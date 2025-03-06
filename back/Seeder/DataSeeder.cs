using Bogus;
using Microsoft.AspNetCore.Identity;
using taekwondo_backend.Data;
using taekwondo_backend.Enums;
using taekwondo_backend.Models;
using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.Seeder;

public class DataSeeder(
    AppDbContext context,
    UserManager<User> userManager,
    RoleManager<Role> roleManager,
    IConfiguration config)
{
    private readonly AppDbContext _context = context;
    private readonly UserManager<User> _userManager = userManager;
    private readonly RoleManager<Role> _roleManager = roleManager;
    private readonly IConfiguration _config = config;
    private string defaultPassword = "Password12#$";

    public async Task ProductionSeed()
    {
        await SeedRoles();
        await SeedSettings();
    }

    public async Task TestSeed()
    {
        await SeedAdmin();
        await SeedInstructorsAndStudents();
        await SeedTimeSlots();
        await SeedSchedules();
        await SeedEvents();
    }
    
    private async Task SeedEvents()
    {
        var events = new List<Event>();
        var random = new Random();
        
        var adminUser = await _userManager.FindByEmailAsync("admin@gmail.com");
        
        if (adminUser == null)
        {
            Console.WriteLine("Admin user not found. Seed operation aborted.");
            return;
        }

        for (int i = 0; i < 10; i++)
        {
            
            var startDate = DateTime.UtcNow.AddDays(random.Next(1, 30)).AddHours(random.Next(0, 24));
            var endDate = startDate.AddHours(random.Next(1, 4)); // Event lasts 1 to 4 hours
        
            var evt = new Event
            {
                User = adminUser,
                Title = $"Event {i + 1}",
                StartsAt = startDate,
                EndsAt = endDate,
                Description = $"Description for event {i + 1}",
                IsOpen = random.Next(0, 2) == 1, // Randomly set IsOpen to true/false
            };
            
            events.Add(evt);
        }
        
        _context.Events.AddRange(events);
        await _context.SaveChangesAsync();
    }

    private async Task SeedSchedules()
    {
        var schedules = new List<Schedule>();
        var random = new Random();

        var timeslots = _context.TimeSlots.ToList();
        var students = await _userManager.GetUsersInRoleAsync(UserRoles.Student.ToString());
        var instructors = await _userManager.GetUsersInRoleAsync(UserRoles.Student.ToString());

        for (int i = 0; i < 30; i++)
        {

            var randomTimeslot = timeslots[random.Next(timeslots.Count)];
            var randomStudents = students.OrderBy(x => random.Next()).Take(random.Next(10, 31)).ToList();
            var randomInstructors = instructors.OrderBy(x => random.Next()).Take(random.Next(2, 3)).ToList();

            string[] classLevels = {
                "Beginner Class 1",
                "Little Warriors 1",
                "Private Lesson",
                "Little Warriors",
                "Family Class",
                "Private Class"
            };

            var schedule = new Schedule
            {
                TimeSlot = randomTimeslot,
                Students = randomStudents,
                Instructors = randomInstructors,
                Day = (DayOfWeek)random.Next(0, 7),
                Level = classLevels[random.Next(classLevels.Length)],
                IsOpen = true,
            };
            schedules.Add(schedule);
        }

        _context.Schedules.AddRange(schedules);
        await _context.SaveChangesAsync();
    }

    private async Task SeedTimeSlots()
    {
        TimeOnly[,] timeArray = new TimeOnly[,]
        {
            { new TimeOnly(10, 00), new TimeOnly(10, 30) },
            { new TimeOnly(10, 35), new TimeOnly(11, 15) },
            { new TimeOnly(11, 20), new TimeOnly(12, 00) },
            { new TimeOnly(11, 20), new TimeOnly(12, 00) },
            { new TimeOnly(12, 10), new TimeOnly(13, 05) },
            { new TimeOnly(15, 30), new TimeOnly(16, 15) },
            { new TimeOnly(16, 30), new TimeOnly(17, 00) },
            { new TimeOnly(17, 00), new TimeOnly(17, 40) },
            { new TimeOnly(17, 40), new TimeOnly(18, 20) },
            { new TimeOnly(18, 30), new TimeOnly(19, 10) },
            { new TimeOnly(18, 30), new TimeOnly(19, 00) },
            { new TimeOnly(19, 10), new TimeOnly(19, 55) },
            { new TimeOnly(19, 50), new TimeOnly(20, 40) }
        };

        var timeSlots = Enumerable.Range(0, timeArray.GetLength(0))
            .Select(i => new TimeSlot(timeArray[i, 0], timeArray[i, 1]))
            .ToList();

        _context.TimeSlots.AddRange(timeSlots);
        await _context.SaveChangesAsync();
    }

    private async Task SeedRoles()
    {
        foreach (var roleName in Enum.GetValues(typeof(UserRoles)).Cast<UserRoles>())
        {
            var roleNameStr = roleName.ToString();
            if (await _roleManager.RoleExistsAsync(roleNameStr)) continue;
            var result = await _roleManager.CreateAsync(new Role(roleNameStr));
            if (result.Succeeded) continue;
            foreach (var error in result.Errors)
            {
                Console.WriteLine($"Error creating role {roleNameStr}: {error.Description}");
            }
        }
    }

    private async Task SeedAdmin()
    {
        var EMAIL = "admin@gmail.com";

        if (await _userManager.FindByEmailAsync(EMAIL) is null)
        {
            var user = new User()
            {
                UserName = EMAIL,
                Email = EMAIL,
                EmailConfirmed = true,
                FirstName = UserRoles.Admin.ToString(),
            };

            await _userManager.CreateAsync(user, defaultPassword);
            await _userManager.AddToRoleAsync(user, UserRoles.Admin.ToString());
        }
    }

    private async Task SeedInstructorsAndStudents()
    {
        var EMAIL = "inst@gmail.com";

        if (await _userManager.FindByEmailAsync(EMAIL) is null)
        {
            var user = new User()
            {
                UserName = EMAIL,
                Email = EMAIL,
                EmailConfirmed = true,
                FirstName = UserRoles.Instructor.ToString(),
            };

            await _userManager.CreateAsync(user, defaultPassword);
            await _userManager.AddToRoleAsync(user, UserRoles.Instructor.ToString());
        }

        EMAIL = "student@gmail.com";

        if (await _userManager.FindByEmailAsync(EMAIL) is null)
        {
            var user = new User()
            {
                UserName = EMAIL,
                Email = EMAIL,
                EmailConfirmed = true,
                FirstName = UserRoles.Student.ToString(),
            };

            await _userManager.CreateAsync(user, defaultPassword);
            await _userManager.AddToRoleAsync(user, UserRoles.Student.ToString());
        }

        var faker = new Faker<User>("en")
            .RuleFor(u => u.FirstName, f => f.Name.FirstName())
            .RuleFor(u => u.LastName, f => f.Name.LastName())
            .RuleFor(u => u.DateOfBirth, f =>
                DateOnly.FromDateTime(f.Date.Between(DateTime.Now.AddYears(-40), DateTime.Now.AddYears(-10))))
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.BeltColor, f => f.PickRandom<BeltColorType>());

        var fakeUsers = faker.Generate(10);

        foreach (var instructor in fakeUsers.Select(user => new User()
        {
            UserName = user.Email,
            Email = user.Email,
            EmailConfirmed = true,
            FirstName = user.FirstName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth,
            BeltColor = user.BeltColor,
        }))
        {
            await _userManager.CreateAsync(instructor, defaultPassword);
            await _userManager.AddToRoleAsync(instructor, UserRoles.Instructor.ToString());

        }

        fakeUsers = faker.Generate(300);

        foreach (var student in fakeUsers.Select(user => new User()
        {
            UserName = user.Email,
            Email = user.Email,
            EmailConfirmed = true,
            FirstName = user.FirstName,
            LastName = user.LastName,
            DateOfBirth = user.DateOfBirth,
            BeltColor = user.BeltColor,
        }))
        {
            await _userManager.CreateAsync(student, defaultPassword);
            await _userManager.AddToRoleAsync(student, UserRoles.Student.ToString());

        }
    }

    private static List<User> GetRandomUsers(List<User> users, int count, Random random)
    {
        var selectedUsers = new List<User>();
        var usedIndexes = new HashSet<int>();

        while (selectedUsers.Count < count)
        {
            int index = random.Next(users.Count);
            if (usedIndexes.Add(index))
            {
                selectedUsers.Add(users[index]);
            }
        }

        return selectedUsers;
    }
    private async Task SeedSettings()
    {
        _context.Settings.RemoveRange(_context.Settings);

        var defaultSetting = new Setting
        {
            OrganizationName = "Taekwondoon",
            Email = "taekwondoon_yyc@gmail.com",
            Street = "123 Centre Avenue SW",
            City = "Calgary",
            Province = "Alberta",
            PostalCode = "T2E 5Y5",
            Country = "Canada",
            MaximumClassSize = 30,
            AbsentAlert = 3,
            PaymentAlert = 7
        };

        await _context.Settings.AddAsync(defaultSetting);
        await _context.SaveChangesAsync();
    }
}

