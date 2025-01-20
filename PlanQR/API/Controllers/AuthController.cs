using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LdapService _ldapService;

        public AuthController(LdapService ldapService)
        {
            _ldapService = ldapService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var (isAuthenticated, givenName, surname) = _ldapService.Authenticate(request.Username, request.Password);

            if (isAuthenticated)
            {
                return Ok(new 
                { 
                    message = "Login successful", 
                    givenName = givenName, 
                    surname = surname 
                });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}