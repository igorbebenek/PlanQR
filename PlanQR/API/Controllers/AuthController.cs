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
            if (_ldapService.Authenticate(request.Username, request.Password))
            {
                return Ok(new { message = "Login successful" });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }
    }
}

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}