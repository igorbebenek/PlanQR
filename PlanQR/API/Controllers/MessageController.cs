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
    public class MessageController : BaseApiController
    {
        private readonly IMediator _mediator;
        public MessageController(IMediator mediator)
        {
            _mediator = mediator;
        }
         
        [HttpPost]
        public async Task<IActionResult> CreateMessage(CreateMessageCommand command)
        {
            await _mediator.Send(command);
            return Ok();
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
    }
}