using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Domain;
using Persistence;

namespace API.Controllers
{
    [ApiController]
    [Route("api/devices")]
    public class DeviceListController : BaseApiController
    {
        private readonly DataContext _context;

        public DeviceListController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceList>>> GetDevices()
        {
            return await _context.DeviceLists.ToListAsync(); // Updated to match DbSet name
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DeviceList>> GetDevice(int id)
        {
            var device = await _context.DeviceLists.FindAsync(id); // Updated to match DbSet name
            if (device == null)
                return NotFound();

            return device;
        }

        [HttpPost]
        public async Task<ActionResult<DeviceList>> CreateDevice([FromBody] CreateDeviceDto dto)
        {
            var urlSource = $"{dto.deviceName}_{dto.deviceClassroom.ToUpper()}"; // Zamiana deviceClassroom na wielkie litery
            var base64Url = Convert.ToBase64String(Encoding.UTF8.GetBytes(urlSource));

            var device = new DeviceList
            {
                deviceName = dto.deviceName, // Bez zmian
                deviceClassroom = dto.deviceClassroom.ToUpper(), // Zamiana na wielkie litery
                deviceURL = base64Url // Bez zmian
            };

            _context.DeviceLists.Add(device); // Dodanie do bazy danych
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDevice), new { id = device.id }, device); // Zwrócenie utworzonego urządzenia
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(int id, [FromBody] DeviceList updatedDevice)
        {
            if (id != updatedDevice.id) // Updated to match camelCase property names
                return BadRequest();

            _context.Entry(updatedDevice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.DeviceLists.Any(e => e.id == id)) // Updated to match DbSet name and camelCase property names
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            var device = await _context.DeviceLists.FindAsync(id); // Updated to match DbSet name
            if (device == null)
                return NotFound();

            _context.DeviceLists.Remove(device); // Updated to match DbSet name
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("validate")]
        public async Task<IActionResult> ValidateRoomAndSecretUrl([FromQuery] string room, [FromQuery] string secretUrl)
        {
            var device = await _context.DeviceLists
                .FirstOrDefaultAsync(d => d.deviceClassroom == room && d.deviceURL == secretUrl);

            if (device == null)
            {
                return NotFound(new { message = "Nie znaleziono urządzenia z podanym room i secretUrl." });
            }

            return Ok(new { message = "Urządzenie znalezione.", device });
        }
    }
}