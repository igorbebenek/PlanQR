namespace Domain{
    public class Message{
        public Guid id {get;set;}
        public string content {get;set;}
        public DateTime date {get;set;}
        public string lecturer {get;set;}
        public Guid roomId {get;set;}
        public string room {get;set;}
    }
}