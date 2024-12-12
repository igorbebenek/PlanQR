using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.Messages
{
    public class Clear
    {
        public class Query : IRequest<string> {}

        public class Handler : IRequestHandler<Query, string>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<string> Handle(Query request, CancellationToken cancellationToken)
            {
                if (_context.Messages == null)
                {
                    return "Message table does not exist.";
                }
                var count = await _context.Messages.AsNoTracking().CountAsync(cancellationToken);
                if (count > 0)
                {
                    _context.Messages.RemoveRange(_context.Messages);
                    await _context.SaveChangesAsync(cancellationToken);
                    return $"Deleted {count} messages.";
                }
                return "No messages to delete.";
            }
        }
    }
}
