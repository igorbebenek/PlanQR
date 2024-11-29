using System.Collections.Generic;

namespace Domain
{
    public class Chat
    {
        public Guid id {get; set;}

        //One-to-One relation with Lesson
        public int lessonID {get; set;} //Foreign key
        public Lesson lesson {get; set;}

        //One-to-Many relation with Messages
        public List<Message> messages { get; set;} = new List<Message>();
    }
}