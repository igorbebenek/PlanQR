namespace Domain
{
    public class Lesson
    {
        public Guid id {get;set;}  // id subject
        public string subject {get;set;} // title
        public string type {get;set;} // lesson_form
        public Guid roomId {get;set;} // room id
        public string room {get;set;} // room
        public string lecturer { get;set;} // worker_title
        public string description { get;set;} // description
        public DateTime start { get;set;} // start
        public DateTime end { get;set;} // end
        public string typeShort { get;set;} // lesson_status_short
        public int semester { get;set;} // semestr
        public string faculty { get;set;} // wydzial
        public string fieldStudies { get;set;} // kierunek
        public string typeStudy { get;set;} // rodzaj 
        public string degreeType { get;set;} // typ
        public string speciality  { get;set;} // specjalnosc
        // public Chat chat {get; set;} //chat
    } 
}