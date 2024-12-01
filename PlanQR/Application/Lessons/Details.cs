using Domain;
using MediatR;
using Persistence;

namespace Application.Lessons
{
    public class Details
    {
        public class Query:IRequest<Lesson> 
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Lesson>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Lesson> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Lessons.FindAsync(request.Id);
            }
        }
    }
}