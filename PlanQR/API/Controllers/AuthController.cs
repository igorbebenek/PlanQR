using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
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
            var (isAuthenticated, givenName, surname) = _ldapService.Authenticate(request.Username, request.Password);

            if (isAuthenticated)
            {
                var token = GenerateJwtToken(request.Username);
                return Ok(new 
                { 
                    message = "Login successful", 
                    givenName = givenName, 
                    surname = surname,
                    Token = token
                });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }

        [HttpGet("token-expiration")]
        public IActionResult GetTokenExpiration([FromHeader] string authorization)
        {
            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return BadRequest(new { Message = "Invalid token" });
            }

            var token = authorization.Substring("Bearer ".Length).Trim();
            var handler = new JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var expiration = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Exp)?.Value;
            if (expiration == null)
            {
                return BadRequest(new { Message = "Invalid token" });
            }

            var expirationTime = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expiration)).UtcDateTime;
            return Ok(new { Expiration = expirationTime });
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
}