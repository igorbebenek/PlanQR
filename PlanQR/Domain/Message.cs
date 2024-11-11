namespace Domain{
    public class Message{
        public Guid Id {get;set;}
        public string Content {get;set;}
        public DateTime Date {get;set;}
        public string Lecturer {get;set;}
        public Guid RoomId {get;set;}
        public string Room {get;set;}
    }
}