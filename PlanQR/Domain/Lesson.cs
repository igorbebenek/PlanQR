namespace Domain
{
    public class Lesson
    {
        public Guid Id {get;set;}
        public string Subject {get;set;}
        public string Type {get;set;}
        public Guid RoomId {get;set;}
        public string Room {get;set;}
        public string Building {get;set;}
        public string Lecturer { get;set;}
        public string Description { get;set;}
        public DateTime Start { get;set;}
        public DateTime End { get;set;}
        public string Lecturer_Title { get;set;} 
        public string Type_Short { get;set;}
        public int Semestr { get;set;}
        public string Faculty_Short { get;set;}
        public string Field_Of_Studies { get;set;}
        public string Type_Study { get;set;}
        public string Degree_Type { get;set;}
        public string Speciality  { get;set;}
    }
}