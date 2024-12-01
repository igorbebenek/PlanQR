using MediatR;
using Persistence;

namespace Application.Lessons
{
    public class Delete
    {
        public class Command : IRequest
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                var lesson = await _context.Lessons.FindAsync(request.Id);
                if (lesson == null) 
                {
                    throw new KeyNotFoundException($"Lesson with ID {request.Id} does not exist.");
                }
                _context.Remove(lesson);
                await _context.SaveChangesAsync();
            }
        }
    }
}