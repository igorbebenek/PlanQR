using Domain;
using Microsoft.EntityFrameworkCore;
namespace Persistence;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<Message> Messages { get; set; }

    public DbSet<DeviceList> DeviceLists { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlite("Data Source=PlanQRDB.db");
        }
    }

    public async Task AddChatAsync(Message message){
        
        await SaveChangesAsync();
    }
}