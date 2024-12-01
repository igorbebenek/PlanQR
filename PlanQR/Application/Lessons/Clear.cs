using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.Lessons
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
                if (_context.Lessons == null)
                {
                    return "Lessons table does not exist.";
                }
                var count = await _context.Lessons.AsNoTracking().CountAsync(cancellationToken);
                if (count > 0)
                {
                    _context.Lessons.RemoveRange(_context.Lessons);
                    await _context.SaveChangesAsync(cancellationToken);
                    return $"Deleted {count} lessons.";
                }
                return "No lessons to delete.";
            }
        }
    }
}
