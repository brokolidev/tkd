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
    }

    public async Task SeedTimeSlots()
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
        
        List<TimeSlot> timeSlots = Enumerable.Range(0, timeArray.GetLength(0))
            .Select(i => new TimeSlot(timeArray[i, 0], timeArray[i, 1]))
            .ToList();

        _context.TimeSlots.AddRange(timeSlots);
        await _context.SaveChangesAsync();
    }

    public async Task TestSeed()
    {
        await SeedAdmin();
        await SeedInstructorsAndStudents();
        await SeedTimeSlots();
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
}

