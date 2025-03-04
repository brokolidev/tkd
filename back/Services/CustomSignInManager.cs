using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication;
using taekwondo_backend.Models.Identity;

namespace taekwondo_backend.Services
{
    public class CustomSignInManager : SignInManager<User>
    {
        private readonly SlackService _slackService;

        // Custom SignInManager to send Slack alerts when login fails
        public CustomSignInManager(
            UserManager<User> userManager,
            IHttpContextAccessor contextAccessor,
            IUserClaimsPrincipalFactory<User> claimsFactory,
            IOptions<IdentityOptions> optionsAccessor,
            ILogger<SignInManager<User>> logger,
            IAuthenticationSchemeProvider schemes,
            IUserConfirmation<User> confirmation,
            SlackService slackService
        ) : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
        {
            _slackService = slackService;
        }

        // Reference: https://chatgpt.com/c/67c3fc29-e8e0-8008-9d7c-fb1b462c95f1
        // guidance on overriding PasswordSignInAsync to send Slack alerts on failed login attempts.
        public override async Task<SignInResult> PasswordSignInAsync(string userName, string password, bool isPersistent, bool lockoutOnFailure)
        {
            // Check if the user exists
            var user = await UserManager.FindByEmailAsync(userName);
            if (user == null)
            {
                // Send an alert to Slack if the user is not found
                await _slackService.SendSlackAlertAsync($"⚠️Login failed detected!⚠️ \n✔️Email: {userName}\n✔️Reason: User not found");
                return SignInResult.Failed;
            }

            // Try to log in with the given password
            var result = await base.PasswordSignInAsync(user, password, isPersistent, lockoutOnFailure);

            // If the login fails due to an incorrect password, send an alert
            if (!result.Succeeded)
            {
                await _slackService.SendSlackAlertAsync($"⚠️Login failed detected!⚠️ \n✔️Email: {userName}\n✔️Reason: Incorrect password");
            }

            return result;
        }
    }
}