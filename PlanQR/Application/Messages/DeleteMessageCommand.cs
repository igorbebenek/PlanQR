using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Infrastructure.Data;

namespace Application.Messages
{
    public class DeleteMessageCommand : IRequest<Unit>
    {
        public int id { get; set; }
        public class Handler : IRequestHandler<DeleteMessageCommand, Unit>
        {
            private readonly MessageRepository _repository;

            public Handler(MessageRepository repository)
            {
                _repository = repository;
            }

            public async Task<Unit> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
            {
                await _repository.DeleteMessageAsync(request.id);
                return Unit.Value;
            }
        }
    }
}