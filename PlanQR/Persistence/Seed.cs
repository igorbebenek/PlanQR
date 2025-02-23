using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;

public class Seed{
    public static async Task DBData(DataContext context){
        if (context.Messages.Any())
        {
            Console.WriteLine("Chats table already has data.");
            context.Database.ExecuteSqlRaw("DELETE FROM Messages");
        }
        else
        {
            Console.WriteLine("Messages table is empty or does not exist.");
        }

        var messages = new[]
        {
            new Message
            {
                createdAt = DateTime.UtcNow,
                body = "Hello",
                lecturer = "Kowalski",
                login = "kowal",
                room = "101",
                lessonId = 1,
                group = "1A"
            },
            new Message
            {
                createdAt = DateTime.UtcNow,
                body = "Hi",
                lecturer = "Nowak",
                login = "nowak",
                room = "102",
                lessonId = 2,
                group = "1B"
            },
            new Message
            {
                createdAt = DateTime.UtcNow,
                body = "Hey",
                lecturer = "Kowal",
                login = "kowal",
                room = "103",
                lessonId = 3,
                group = "1C"
            }
        };

        await context.Messages.AddRangeAsync(messages);
        await context.SaveChangesAsync();
    }
}