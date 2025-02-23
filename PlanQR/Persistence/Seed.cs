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
        }
        else
        {
            Console.WriteLine("Messages table is empty or does not exist.");
        }

        await context.SaveChangesAsync();
    }
}