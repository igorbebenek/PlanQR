import { useState, useEffect } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import './MyCalendar.css';
import plLocale from '@fullcalendar/core/locales/pl';
import { useParams } from 'react-router-dom';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { fetchMessages } from "../services/messageService";
import { EventApi, EventClickArg } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';

export default function MyCalendar() {
  const { department, room } = useParams();
  const [events, setEvents] = useState([]); 
  const [currentDates, setCurrentDates] = useState({ start: '', end: '' });

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [login, setLogin] = useState<string | null>(null);
  const [lessonLogin, setLessonLogin] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);


  useEffect(() => {
    document.title = `Plan sali - ${room}` 
  }
  , []);

  const handleEventClick = (info: EventClickArg) => {
    const event = info.event;
    console.log("Clicked event:", event.extendedProps);

    setSelectedEvent(event);
    const lessonId = event.extendedProps.id;

    if (lessonId) {
      setSelectedLessonId(lessonId);
      setLessonLogin(event.extendedProps.login);
      fetchMessages(lessonId)
        .then(setMessages)
        .catch((err) => console.error("Error fetching messages:", err));
    } else {
      console.error("Lesson ID is missing!");
    }

    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSelectedEvent(null);
    setIsSidebarOpen(false);
  };

  const [calendarView, setCalendarView] = useState(window.innerWidth < 600 ? 'listWeek' : 'timeGridWeek');

  const handleWindowResize = () => {
    if (window.innerWidth < 600) {
      setCalendarView('listWeek');
    } else {
      setCalendarView('timeGridWeek');
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const fetchEvents = async (startDate: string, endDate: string) => {
    const url = `/schedule_student.php?kind=apiwi&department=${department}&room=${room}&start=${startDate}&end=${endDate}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();

      setEvents(data.map((event: any) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
        color: event.color,
        borderColor: event.borderColor,
        worker: event.worker,
        worker_title: event.worker_title,
        worker_cover: event.worker_cover,
        room: event.room,
        group_name: event.group_name,
        lesson_form: event.lesson_form,
        lesson_status: event.lesson_status,
        lesson_form_short: event.lesson_form_short,
        tok_name: event.tok_name,
        lesson_status_short: event.lesson_status_short,
        status_item: event.status_item,
        subject: event.subject,
        wydzial: event.wydzial,
        wydz_sk: event.wydz_sk,
        extendedProps: {
          id: event.id,
          login: event.login,
        }
      })));

      console.log('Fetched events:', data); 
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    if (currentDates.start && currentDates.end) {
      fetchEvents(currentDates.start, currentDates.end);
    }
    const intervalId = setInterval(() => {
      if (currentDates.start && currentDates.end) {
        fetchEvents(currentDates.start, currentDates.end);
      }
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [department, room, currentDates]);

  return (
    <>
    <div className="lecturer-calendar">
    <div className={`main-content ${isSidebarOpen ? 'shrink' : ''}`}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={calendarView}
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,dayGridMonth,timeGridDay',
        }}
        height="auto"
        locale={plLocale}
        allDaySlot={false}
        datesSet={(dateInfo) => {
          setCurrentDates({
            start: dateInfo.startStr,
            end: dateInfo.endStr,
          });
        }}
        eventDidMount={(info) => {
          // Sprawdzenie, czy użytkownik korzysta z ekranu dotykowego
          const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
          if (!isTouchDevice) {
            const content = `${info.event.title} , prowadzący ${info.event.extendedProps.worker_title}, sala ${info.event.extendedProps.room}, grupa ${info.event.extendedProps.group_name} - ${info.event.extendedProps.lesson_status}`;
            tippy(info.el, {
              content: content,
              placement: 'top',
              trigger: 'mouseenter focus', // Wyświetlanie tylko po najechaniu myszką lub skupieniu
              theme: 'custom-yellow',
            });
          }
        }}
        eventClick={handleEventClick}
        slotMinTime="07:00:00"
        slotMaxTime="22:00:00"
        windowResize={handleWindowResize}
        
      />
      </div>
      {isSidebarOpen && (
              <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <button
                  className="sidebarCloseButton"
                  onClick={closeSidebar}
                >
                  Zamknij
                </button>
                {selectedEvent ? (
                  <div>
                    <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>

                    <p><strong>Sala:</strong> {selectedEvent.extendedProps.room}<strong>  Grupa:</strong> {selectedEvent.extendedProps.group_name}</p>
                  </div>
                ) : (
                  <p>Brak szczegółów wydarzenia</p>
                )}
                <div className="sidebarChat">
                  <div className="messages-container">
                    {messages.map((msg, index) => (
                      <div key={index} className="message-wrapper">
                        <div className="message-header">
                          <strong>{msg.lecturer}</strong>
                          <span className="message-time">{msg.createdAt ? formatDate(msg.createdAt) : "Invalid Date"}</span>
                        </div>
                        <div className="message-bubble">
                          <p className="message-text">{msg.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
    </>
  );
}