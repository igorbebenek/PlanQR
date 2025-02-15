using System.Dynamic;

namespace Domain{
    public class Message{
        public int id {get;set;}
        public DateTime createdAt {get;set;} = DateTime.UtcNow;
        public string lecturer {get;set;}
        public string room {get;set;}
        public int lessonId {get;set;}
        

        // Many-to-One relation with Chat
        public int chatID {get; set;} //Foreign key
        public Chat chat {get; set;}
    }
}