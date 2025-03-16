using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace back.Tests
{
    public class JwtServiceTests
    {
        private const string SecretKey = "mysuperlongsecurekey_must_be_at_least_32_chars!";

        /// <summary>
        /// Creates a symmetric security key from the constant secret key.
        /// </summary>
        private SymmetricSecurityKey GetSecurityKey()
        {
            var keyBytes = Encoding.UTF8.GetBytes(SecretKey);
            return new SymmetricSecurityKey(keyBytes);
        }

        /// <summary>
        /// Creates signing credentials using the symmetric security key.
        /// </summary>
        private SigningCredentials GetSigningCredentials()
        {
            return new SigningCredentials(GetSecurityKey(), SecurityAlgorithms.HmacSha256);
        }

        /// <summary>
        /// Returns a common TokenValidationParameters object with lifetime, issuer, and audience validation.
        /// </summary>
        private TokenValidationParameters GetTokenValidationParameters()
        {
            return new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = GetSecurityKey(),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        }

        /// <summary>
        /// Helper method to create a JWT token string from a token descriptor.
        /// </summary>
        private string CreateToken(SecurityTokenDescriptor tokenDescriptor)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [Fact]
        public void ExpiredToken_ShouldThrowSecurityTokenExpiredException()
        {
            // Arrange: Create a token that expired 5 minutes ago.
            var expiredTime = DateTime.UtcNow.AddMinutes(-5);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, "testUser")
                }),
                Expires = expiredTime,
                // Ensure NotBefore is earlier than Expires.
                NotBefore = expiredTime.AddMinutes(-1),
                SigningCredentials = GetSigningCredentials()
            };

            var tokenString = CreateToken(tokenDescriptor);
            var validationParameters = GetTokenValidationParameters();
            var tokenHandler = new JwtSecurityTokenHandler();

            // Act & Assert: Validating the expired token should throw a SecurityTokenExpiredException.
            Assert.Throws<SecurityTokenExpiredException>(() =>
            {
                SecurityToken validatedToken;
                var principal = tokenHandler.ValidateToken(tokenString, validationParameters, out validatedToken);
            });
        }

        [Fact]
        public void ValidToken_ShouldValidateSuccessfully()
        {
            // Arrange: Create a token that is valid (expires in 15 minutes).
            var futureTime = DateTime.UtcNow.AddMinutes(15);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, "testUser")
                }),
                NotBefore = DateTime.UtcNow.AddSeconds(-30),
                Expires = futureTime,
                SigningCredentials = GetSigningCredentials()
            };

            var tokenString = CreateToken(tokenDescriptor);
            var validationParameters = GetTokenValidationParameters();
            var tokenHandler = new JwtSecurityTokenHandler();

            // Act: Validate the token.
            SecurityToken validatedToken = null;
            var principal = tokenHandler.ValidateToken(tokenString, validationParameters, out validatedToken);

            // Assert: The validated token and the principal should not be null.
            Assert.NotNull(validatedToken);
            Assert.NotNull(principal);

            // Check for the subject claim under both possible claim types.
            var subjectClaim = principal.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)
                               ?? principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            Assert.NotNull(subjectClaim);
            Assert.Equal("testUser", subjectClaim.Value);
        }
    }
}
