using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Infrastructure.Data; 

namespace Application.Messages
{
    public class CreateMessageCommand : IRequest<Unit>
    {
        public string body { get; set; }
        public string lecturer { get; set; }
        public string login { get; set; }
        public string room { get; set; }
        public int lessonId { get; set; }
        public string group { get; set; }
        public DateTime createdAt { get; set; } // Тепер сервер не змінює час

        public class Handler : IRequestHandler<CreateMessageCommand,Unit>
        {
            private readonly MessageRepository _repository;

            public Handler(MessageRepository repository)
            {
                _repository = repository;
            }

            public async Task<Unit> Handle(CreateMessageCommand request, CancellationToken cancellationToken)
            {
                var message = new Message
                {
                    body = request.body,
                    lecturer = request.lecturer,
                    login = request.login,
                    room = request.room,
                    lessonId = request.lessonId,
                    group = request.group,
                    createdAt = TimeZoneInfo.ConvertTimeFromUtc(request.createdAt, TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time")) 

                };

                await _repository.AddMessageAsync(message);

                return Unit.Value;
            }
        }
    }
}