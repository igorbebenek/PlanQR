using Application.Lessons;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LessonController : BaseApiController
    {
        [HttpGet]  //api/lessons
        public async Task<ActionResult<List<Lesson>>> GetLessons()
        {
            return await Mediator.Send(new Get.Query());
        }

        [HttpGet("{roomId}")] //api/lessons/roomId
        public async Task<ActionResult<Lesson>> GetLesson(Guid roomId)
        {
            return await Mediator.Send(new Details.Query{Id = roomId});
        }

        [HttpDelete("clear")] // api/lessons/clear
        public async Task<IActionResult> ClearLessons()
        {
            await Mediator.Send(new Clear.Query());
            return NoContent();
        }

        [HttpDelete("{roomId}")] 
        public async Task<IActionResult> DeleteLesson(Guid roomId)
        {
            await Mediator.Send(new Delete.Command{Id = roomId});
            return Ok();
        }

        /*
        [HttpPost("Load-XML")]
        public async Task<IActionResult> LoadLessonsFromXml()
        {
            // code here
        } 

        [HttpPost("Update-XML")]
        public async Task<IActionResult> UpdateLessonsFromXml()
        {
            // code here 
        }
        */
    }
}
