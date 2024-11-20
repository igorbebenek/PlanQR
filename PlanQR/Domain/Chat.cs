using System.Collections.Generic;

namespace Domain
{
    public class Chat
    {
        public Guid id {get; set;}
        public List<Message> messages { get; set; } = new List<Message>();
    }
}