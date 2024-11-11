using Domain;
using Microsoft.EntityFrameworkCore;
namespace Persistence;

public class DataContext : DbContext
{
    public DbSet<Lesson> Lessons{get;set;}
    public DbSet<Message> Messages{get;set;}

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source = PlanQRDB");
        //optionsBuilder.UseSqlite("Server={server_address};Database={database_name};UserId={username};Password={password};");
    }

} 
