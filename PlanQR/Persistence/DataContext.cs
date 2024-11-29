using Domain;
using Microsoft.EntityFrameworkCore;
namespace Persistence;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Chat> Chats { get; set; }

    //Adding relations between tables
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // One-to-One: Lesson -> Chat
            modelBuilder.Entity<Lesson>()
                .HasOne(l => l.chat)
                .WithOne(c => c.lesson)
                .HasForeignKey<Chat>(c => c.lessonID);

            // One-to-Many: Chat -> Messages
            modelBuilder.Entity<Chat>()
                .HasMany(c => c.messages)
                .WithOne(m => m.chat)
                .HasForeignKey(m => m.chatID);
                
        base.OnModelCreating(modelBuilder);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlite("Data Source=PlanQRDB.db");
        }
    }

    public async Task AddLessonAsync(Lesson lesson){
        Lessons.Add(lesson);
        await SaveChangesAsync();
    }
}