using Domain;
using Microsoft.EntityFrameworkCore;
namespace Persistence;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }
    public DbSet<Lesson> Lessons{get;set;}
    public DbSet<Message> Messages{get;set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source = PlanQRDB.db");
    }

} 
