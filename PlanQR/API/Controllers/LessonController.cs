using Application.Messages;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LessonController : BaseApiController
    {
        
        [HttpGet("messages/list")]  //api/messages
        public async Task<ActionResult<List<Message>>> GetMessages()
        {
            return await Mediator.Send(new Get.Query());
        }

        
        [HttpGet("message/{roomId}")] //api/messages/roomId
        public async Task<ActionResult<Message>> GetMessage(int roomId)
        {
            return await Mediator.Send(new Details.Query{Id = roomId});
        }

        [HttpDelete("messages/clear")] // api/messages/clear
        public async Task<IActionResult> ClearMessages()
        {
            var result = await Mediator.Send(new Clear.Query());
            return Ok(result);
        }

        [HttpDelete("message/delete/{roomId}")] 
        public async Task<IActionResult> DeleteMessage(int roomId)
        {
            try
            {
                await Mediator.Send(new Delete.Command{Id = roomId});
                return Ok();
            } catch (KeyNotFoundException ex) {
                return NotFound(new {error = ex.Message});
            }
        }
    }
}
