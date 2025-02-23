using System.Dynamic;

namespace Domain{
    public class Message{
        public int id {get;set;}
        public DateTime createdAt {get;set;} = DateTime.UtcNow;
        public string body {get;set;}
        public string lecturer {get;set;}
        public string login {get;set;}
        public string room {get;set;}
        public int lessonId {get;set;}
        public string group {get;set;}
    }
}