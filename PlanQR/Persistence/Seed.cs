using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;

public class Seed{
    public static async Task DBData(DataContext context){
        if (context.Chats.Any())
        {
            Console.WriteLine("Chats table already has data.");
            context.Database.ExecuteSqlRaw("DELETE FROM Chats");
        }
        else
        {
            Console.WriteLine("Chats table is empty or does not exist.");
        }

        var chats = new[]
        {
            new Chat
            {
                messages = new List<Message>
                {
                    new Message
                    {
                        content = "Welcome to the Calculus lecture!",
                        date = DateTime.UtcNow,
                        lecturer = "Dr. John Smith",
                        roomId = Guid.NewGuid(),
                        room = "A101"
                    },
                    new Message
                    {
                        content = "Please review limits before the next class.",
                        date = DateTime.UtcNow.AddMinutes(30),
                        lecturer = "Dr. John Smith",
                        roomId = Guid.NewGuid(),
                        room = "A101"
                    }
                }
            },
            new Chat
            {
                messages = new List<Message>
                {
                    new Message
                    {
                        content = "Welcome to the Calculus lecture!",
                        date = DateTime.UtcNow,
                        lecturer = "Dr. John Smith",
                        roomId = Guid.NewGuid(),
                        room = "A101"
                    },
                    new Message
                    {
                        content = "Please review limits before the next class.",
                        date = DateTime.UtcNow.AddMinutes(30),
                        lecturer = "Dr. John Smith",
                        roomId = Guid.NewGuid(),
                        room = "A101"
                    }
                }
            },
            new Chat
            {
                messages = new List<Message>
                {
                    new Message
                    {
                        content = "Welcome to the Calculus lecture!",
                        date = DateTime.UtcNow,
                        lecturer = "Dr. John Smith",
                        roomId = Guid.NewGuid(),
                        room = "A101"
                    },
                    new Message
                    {
                        content = "Please review limits before the next class.",
                        date = DateTime.UtcNow.AddMinutes(30),
                        lecturer = "Dr. John Smith",
                        roomId = Guid.NewGuid(),
                        room = "A101"
                    }
                }
            },
            new Chat
            {
                messages = new List<Message>
                {
                    new Message
                    {
                        content = "Welcome to the Calculus lecture!",
                        date = DateTime.UtcNow,
                        lecturer = "Dr. John Smith",
                        roomId = Guid.NewGuid(),
                        room = "A101"
                    },
                    new Message
                    {
                        content = "Please review limits before the next class.",
                        date = DateTime.UtcNow.AddMinutes(30),
                        lecturer = "Dr. John Smith",
                        roomId = Guid.NewGuid(),
                        room = "A101"
                    }
                }
            },
        };

        await context.Chats.AddRangeAsync(chats);
        await context.SaveChangesAsync();
    }
}