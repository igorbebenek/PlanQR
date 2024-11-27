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
        }
        else
        {
            Console.WriteLine("Lessons table is empty or does not exist.");
        }

        var lessons = new[]
        {
            new Lesson
            {
                id = Guid.NewGuid(),
                subject = "Mathematics",
                type = "Lecture",
                roomId = Guid.NewGuid(),
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
                speciality = "General Mathematics"
            },
            new Lesson
            {
                id = Guid.NewGuid(),
                subject = "Physics",
                type = "Laboratory",
                roomId = Guid.NewGuid(),
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
                speciality = "Applied Physics"
            },
            new Lesson
            {
                id = Guid.NewGuid(),
                subject = "Chemistry",
                type = "Lecture",
                roomId = Guid.NewGuid(),
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
                speciality = "General Chemistry"
            },
            new Lesson
            {
                id = Guid.NewGuid(),
                subject = "Biology",
                type = "Seminar",
                roomId = Guid.NewGuid(),
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
                speciality = "Cellular Biology"
            },
            new Lesson
            {
                id = Guid.NewGuid(),
                subject = "Computer Science",
                type = "Lecture",
                roomId = Guid.NewGuid(),
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
                speciality = "Software Engineering"
            },
            new Lesson
            {
                id = Guid.NewGuid(),
                subject = "History",
                type = "Lecture",
                roomId = Guid.NewGuid(),
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
                speciality = "Medieval Studies"
            }
        };

        await context.Lessons.AddRangeAsync(lessons);
        await context.SaveChangesAsync();
    }
}