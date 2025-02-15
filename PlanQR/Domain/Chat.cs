using System.Collections.Generic;
using System.Transactions;

namespace Domain
{
    public class Chat
    {
        public int id {get; set;}
        public int lessonId {get; set;}
        //One-to-Many relation with Messages
        public ICollection<Message> messages { get; set;} = new List<Message>();
    }
}