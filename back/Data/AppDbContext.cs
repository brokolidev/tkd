using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using taekwondo_backend.Models;
using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User, Role, int>(options)
    {
        /*
         * So this file defines all of the tables in the system.
         * when something is DbSet in this class, the add-migration will read it, and
         * create/update tables as needed.
         * 
         * this class is also what is injected into all of the controllers as the
         * context variable, allowing each controller to access the tables needed.
         */
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // use User instead of AspNetUsers
            modelBuilder.Entity<User>(b =>
            {
                b.ToTable("Users");
            });

            // configuring relationship for students
            modelBuilder.Entity<Schedule>()
                .HasMany(s => s.Students)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "ScheduleStudentUser", //junction table name
                    userCol => userCol.HasOne<User>().WithMany().HasForeignKey("userId"), //Foreign key col for the user
                    scheduleCol => scheduleCol.HasOne<Schedule>().WithMany().HasForeignKey("scheduleId") //Foreign key col for the schedule
                );

            //configuring relationship for Instructors
            modelBuilder.Entity<Schedule>()
                .HasMany(s => s.Instructors)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "ScheduleInstructorUser", //junction table name
                    userCol => userCol.HasOne<User>().WithMany().HasForeignKey("userId"), //Foreign key col for the user
                    scheduleCol => scheduleCol.HasOne<Schedule>().WithMany().HasForeignKey("studentId") //Foreign key col for the schedule
                );


            // TimeSlots
            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.Id)
                .UseIdentityColumn();

            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.StartsAt)
                .HasConversion(v => v.ToString(), v => TimeOnly.Parse(v));

            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.EndsAt)
                .HasConversion(v => v.ToString(), v => TimeOnly.Parse(v));

            modelBuilder.Entity<TimeSlot>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();


            // Schedules
            modelBuilder.Entity<Schedule>()
                .Property(t => t.Id)
                .UseIdentityColumn();

            modelBuilder.Entity<Schedule>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
            
            // Events
            modelBuilder.Entity<Event>()
                .Property(t => t.Id)
                .UseIdentityColumn();

            modelBuilder.Entity<Event>()
                .Property(t => t.CreatedAt)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .ValueGeneratedOnAdd();
        }

        public required DbSet<TimeSlot> TimeSlots { get; set; }
        public required DbSet<Schedule> Schedules { get; set; }
        public required DbSet<Event> Events { get; set; }
        public required DbSet<Setting> Settings { get; set; }
        public required DbSet<AttendanceRecord> AttendanceRecords { get; set; }
    }
}
