using Domain;
using Microsoft.EntityFrameworkCore;
namespace Persistence;

public class DataContext : DbContext
{
    public DbSet<Lesson> Lessons{get;set;}
    public DbSet<Message> Messages{get;set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Server=(localdb)\\mssqllocaldb;Database=SchoolDb;Trusted_Connection=True;");
        //optionsBuilder.UseSqlite("Server={server_address};Database={database_name};UserId={username};Password={password};");
    }

} 
