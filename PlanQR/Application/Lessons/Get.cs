using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Lessons
{
    public class Get
    {
        public class Query : IRequest<List<Lesson>> {}

        public class Handler : IRequestHandler<Query, List<Lesson>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Lesson>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Lessons.ToListAsync();
            }
        }
    }
}
