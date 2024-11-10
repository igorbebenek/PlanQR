using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetLessons()
        {
            var lessons = new List<string> { "Lesson 1", "Lesson 2", "Lesson 3" };
            return Ok(lessons); 
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> GetLesson(int roomId)
        {
            var lesson = $"Lesson {roomId}";
            return Ok(lesson); 
        }

        [HttpPost]
        public async Task<IActionResult> CreateLesson([FromBody] string newLesson)
        {
            return CreatedAtAction(nameof(GetLesson), new { roomId = 1 }, newLesson); 
        }

        [HttpPut("{roomId}")]
        public async Task<IActionResult> UpdateLesson(int roomId, [FromBody] string updatedLesson)
        {
            return NoContent(); 
        }

        [HttpDelete("{roomId}")]
        public async Task<IActionResult> DeleteLesson(int roomId)
        {
            return NoContent(); 
        }
    }
}
