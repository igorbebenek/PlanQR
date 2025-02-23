using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Infrastructure.Data; 

namespace Application.Messages
{
    public class GetMessagesQuery : IRequest<List<Message>>
    {
        public int lessonId { get; set; }

        public class Handler : IRequestHandler<GetMessagesQuery, List<Message>>
        {
            private readonly MessageRepository _repository;

            public Handler(MessageRepository repository)
            {
                _repository = repository;
            }

            public async Task<List<Message>> Handle(GetMessagesQuery request, CancellationToken cancellationToken)
            {
                return await _repository.GetMessagesByLessonIdAsync(request.lessonId);
            }
        }
    }
}