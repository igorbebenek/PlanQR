using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Services;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LdapService _ldapService;
        private readonly IConfiguration _configuration;

        public AuthController(LdapService ldapService, IConfiguration configuration)
        {
            _ldapService = ldapService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Invalid request" });
            }

            var (isAuthenticated, givenName, surname) = _ldapService.Authenticate(request.Username, request.Password);

            if (isAuthenticated)
            {
                var token = GenerateJwtToken(request.Username);

                _ldapService.CloseConnection();

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    Expires = DateTime.Now.AddMinutes(30),
                    SameSite = SameSiteMode.Strict
                };
                Response.Cookies.Append("jwt", token, cookieOptions);

                return Ok(new 
                { 
                    message = "Login successful", 
                    givenName = givenName, 
                    surname = surname,
                });
            }

            _ldapService.CloseConnection();

            return Unauthorized(new { message = "Invalid username or password" });
        }

        [HttpPost("validate-token")]
        public IActionResult ValidateToken()
        {
            var token = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "Token is missing" });
            }

            var handler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken;
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidAudience = _configuration["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]))
            };

            try
            {
                handler.ValidateToken(token, validationParameters, out validatedToken);
                var jwtToken = handler.ReadJwtToken(token);
                var username = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

                return Ok(new { message = "Token is valid", username = username });
            }
            catch (SecurityTokenExpiredException)
            {
                return Unauthorized(new { message = "Token has expired" });
            }
            catch (Exception)
            {
                return Unauthorized(new { message = "Invalid token" });
            }
        }

        private string GenerateJwtToken(string username)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class TokenRequest
    {
        public string Token { get; set; }
    }
}