using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;

public class Seed{
    public static async Task DBData(DataContext context){
        if (context.Lessons.Any())
        {
            Console.WriteLine("Lessons table already has data.");
            context.Database.ExecuteSqlRaw("DELETE FROM Lessons");
        }
        else
        {
            Console.WriteLine("Lessons table is empty or does not exist.");
        }

        var lessons = new[]
        {
            new Lesson
            {
                id = 1,
                subject = "Mathematics",
                room = "Room 101",
                lecturer = "Dr. John Doe",
                description = "Algebra basics",
                start = DateTime.Now,
                end = DateTime.Now.AddHours(2),
                typeShort = "L",
                semester = 1,
                faculty = "Mathematics Department",
                fieldStudies = "Mathematics",
                typeStudy = "Full-time",
                degreeType = "Bachelor",
                speciality = "General Mathematics",
                chat = new Chat
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
                }
            },
            new Lesson
            {
                id = 2,
                subject = "Physics",
                room = "Lab 202",
                lecturer = "Dr. Jane Smith",
                description = "Mechanics and thermodynamics",
                start = DateTime.Now.AddDays(1),
                end = DateTime.Now.AddDays(1).AddHours(3),
                typeShort = "L",
                semester = 1,
                faculty = "Physics Department",
                fieldStudies = "Physics",
                typeStudy = "Full-time",
                degreeType = "Bachelor",
                speciality = "Applied Physics",
                chat = new Chat
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
                }
            },
            new Lesson
            {
                id = 3,
                subject = "Chemistry",
                room = "Room 303",
                lecturer = "Dr. Emily Brown",
                description = "Introduction to Organic Chemistry",
                start = DateTime.Now.AddDays(2),
                end = DateTime.Now.AddDays(2).AddHours(2),
                typeShort = "L",
                semester = 1,
                faculty = "Chemistry Department",
                fieldStudies = "Chemistry",
                typeStudy = "Full-time",
                degreeType = "Bachelor",
                speciality = "General Chemistry",
                chat = new Chat
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
                }
            },
            new Lesson
            {
                id = 4,
                subject = "Biology",
                room = "Room 405",
                lecturer = "Dr. Sarah Green",
                description = "Cell Structure and Function",
                start = DateTime.Now.AddDays(3),
                end = DateTime.Now.AddDays(3).AddHours(1.5),
                typeShort = "S",
                semester = 1,
                faculty = "Biology Department",
                fieldStudies = "Biology",
                typeStudy = "Full-time",
                degreeType = "Bachelor",
                speciality = "Cellular Biology",
                chat = new Chat
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
                }
            },
            new Lesson
            {
                id = 5,
                subject = "Computer Science",
                room = "Room 501",
                lecturer = "Dr. Michael Johnson",
                description = "Basics of Algorithms",
                start = DateTime.Now.AddDays(4),
                end = DateTime.Now.AddDays(4).AddHours(2),
                typeShort = "L",
                semester = 1,
                faculty = "Computer Science Department",
                fieldStudies = "Computer Science",
                typeStudy = "Full-time",
                degreeType = "Bachelor",
                speciality = "Software Engineering",
                chat = new Chat
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
                }
            },
            new Lesson
            {
                id = 6,
                subject = "History",
                room = "Room 207",
                lecturer = "Dr. Laura Wilson",
                description = "Medieval Europe",
                start = DateTime.Now.AddDays(5),
                end = DateTime.Now.AddDays(5).AddHours(2),
                typeShort = "L",
                semester = 1,
                faculty = "History Department",
                fieldStudies = "History",
                typeStudy = "Full-time",
                degreeType = "Bachelor",
                speciality = "Medieval Studies",
                chat = new Chat
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
                }
            }
        };

        await context.Lessons.AddRangeAsync(lessons);
        await context.SaveChangesAsync();
    }
}