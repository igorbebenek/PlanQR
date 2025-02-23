namespace Domain
{
    public class Lesson
    {
        public int id {get; set;} //subject id
        public string subject {get; set;} //title
        public DateTime start { get;set;} // start
        public DateTime end { get;set;} // end
        public string lessonType {get;set;} // lesson_form
        public string typeShort { get;set;} // lesson_status_short
        public string room {get;set;} // room
        public string lecturer { get;set;} // worker_title
        public string description { get;set;} // description
        public int semester { get;set;} // semestr
        public string faculty { get;set;} // wydzial
        public string fieldStudies { get;set;} // kierunek
        public string typeStudy { get;set;} // rodzaj 
        public string degreeType { get;set;} // typ
        public string speciality  { get;set;} // specjalnosc

    // zmien worker_title na worker
    // dodaj worker_cover -> to jest od zastępstw
    // dodaj wydzial_sk 
    // dodaj group_name
    } 
}