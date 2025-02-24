using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Messages;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/messages")]
    public class MessageController : BaseApiController
    {
        private readonly IMediator _mediator;
        public MessageController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage([FromBody] CreateMessageCommand command)
        {
            if (command == null)
                return BadRequest("Invalid request");
            Console.WriteLine($"Received message: {command.body} from {command.login} for lesson {command.lessonId}");
            var result = await _mediator.Send(command);
            return Ok(result);
        }


        [HttpGet("{lessonId}")]
        public async Task<ActionResult<List<Message>>> GetMessages(int lessonId)
        {
            return await _mediator.Send(new GetMessagesQuery { lessonId = lessonId });
        }

        [HttpGet]
        public async Task<ActionResult<List<Message>>> GetAllMessages()
        {
            return await _mediator.Send(new GetAllMessagesQuery());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMessage(int id)
        {
            await _mediator.Send(new DeleteMessageCommand { id = id });
            return NoContent();
        }
    }
}