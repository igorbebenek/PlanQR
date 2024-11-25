using MediatR;
using Persistence;

namespace Application.Lessons
{
    public class Clear
    {
        public class Query : IRequest<string>
        {

        }

        public class Handler : IRequestHandler<Query,string>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<string> Handle(Query request, CancellationToken cancellationToken)
            {
                var count = _context.Lessons.Count();
                if(count != 0)
                {
                    _context.Lessons.RemoveRange(_context.Lessons);
                    await _context.SaveChangesAsync(cancellationToken); 
                }
                return $"Deleted {count} lessons."; 
            }
        }
    }
}
