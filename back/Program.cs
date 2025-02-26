using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using taekwondo_backend.Services;
using taekwondo_backend.Data;
using taekwondo_backend.Models.Identity;
using taekwondo_backend.Seeder;

namespace taekwondo_backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            //create a new web app builder, to add the other settings below to
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddHealthChecks();

            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:3001", "http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            // Add services to the container.
            builder.Services.AddControllers();
            // Add services to Azure bob service 
            builder.Services.AddSingleton<AzureBlobStorageService>();

            // Add a database context to the container
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseNpgsql(
                    builder.Configuration.GetConnectionString("DefaultConnection")
                );
            });

            // Add JWT authentication to the container
            var jwtSecret = builder.Configuration["Jwt:SecretKey"] ?? "DEFAULTSECRETKEYISHERE";
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
                    };
                });
            builder.Services.AddAuthorization();
            builder.Services.AddIdentityApiEndpoints<User>()
                .AddRoles<Role>()
                .AddEntityFrameworkStores<AppDbContext>();

            builder.Services.AddScoped<JwtService>();
            builder.Services.AddTransient<DataSeeder>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();
            app.MapHealthChecks("/healthz");

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.MapIdentityApi<User>();

            app.UseHttpsRedirection();

            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // Seeder
            using (var scope = app.Services.CreateScope())
            {
                var seeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();
                await seeder.ProductionSeed();

                // Uncomment this if you need to generate some seed data
                // if (app.Environment.IsDevelopment())
                // {
                //     await seeder.TestSeed();
                // }

            }

            app.Run();
        }
    }
}
