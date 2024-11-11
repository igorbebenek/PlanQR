namespace Domain
{
    public class Lesson
    {
        public Guid Id {get;set;}
        public string Subject {get;set;}
        public string Type {get;set;}
        public DateTime Date {get;set;}
        public Guid RoomId {get;set;}
        public string Room {get;set;}
        public string Building {get;set;}
        public string Lecturer { get;set;}
    }
}