using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

public class NotificationCleanupService : IHostedService, IDisposable
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<NotificationCleanupService> _logger;
    private Timer? _timer;

    public NotificationCleanupService(IServiceProvider serviceProvider, ILogger<NotificationCleanupService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Notification cleanup service is starting.");

        // Run cleanup every 24 hours
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(24));

        return Task.CompletedTask;
    }

private void DoWork(object? state)
{
    using (var scope = _serviceProvider.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();

        try
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-30);
            var oldMessages = context.Messages
                .Where(m => m.createdAt < cutoffDate);

            context.Messages.RemoveRange(oldMessages);
            context.SaveChanges();
            
            // _logger.LogInformation($"Cleaned up {oldMessages.Count()} old messages from the database.");
            // _logger.LogInformation($"Cleanup completed at {cutoffDate}.");
            // _logger.LogInformation("Old messages successfully cleaned up.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while cleaning up messages.");
        }
    }
}

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Notification cleanup service is stopping.");

        _timer?.Change(Timeout.Infinite, 0);

        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}