using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Infrastructure.Data;

namespace Application.Messages
{
    public class GetAllMessagesQuery : IRequest<List<Message>>
    {
    }
    public class Handler : IRequestHandler<GetAllMessagesQuery, List<Message>>
    {
        private readonly MessageRepository _repository;

        public Handler(MessageRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Message>> Handle(GetAllMessagesQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetAllMessagesAsync();
        }
    }
}