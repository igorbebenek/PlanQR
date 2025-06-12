import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list'; // Import list plugin
import plLocale from '@fullcalendar/core/locales/pl';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { EventApi, EventClickArg } from '@fullcalendar/core';
import { fetchMessages, createMessage, deleteMessage } from "../services/messageService";
import { FaTrashAlt } from "react-icons/fa"; 
import * as leoProfanity from "leo-profanity";
import polishBadWords from "../../assets/badWords";

leoProfanity.loadDictionary("en");
leoProfanity.add(polishBadWords);

const siteUrl = import.meta.env.VITE_SITE_URL;

export default function LecturerCalendar() {
  useEffect(() => {
    document.title = `Plan wykładowcy - ${teacher}`;
    leoProfanity.loadDictionary("en");
    leoProfanity.add(polishBadWords);
  }
  , []);

  const { teacher } = useParams();
  const [events, setEvents] = useState([]);
  const [currentDates, setCurrentDates] = useState({ start: '', end: '' });

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [login, setLogin] = useState<string | null>(null);
  const [lessonLogin, setLessonLogin] = useState<string | null>(null);

  const fetchEvents = async (startDate: string, endDate: string) => {
    const url = `/schedule_student.php?kind=apiwi&teacher=${teacher}&start=${startDate}&end=${endDate}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();

      setEvents(data.map((event: any) => ({
        id: event.id,
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
        login: event.login,
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

  //Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

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

  const handleSendMessage = async () => {
    const localTime = new Date();
    console.log(localTime);
    if (selectedLessonId && newMessage.trim() !== "") {
      const sanitizedMessage = leoProfanity.clean(newMessage); 
      const message = {
        body: sanitizedMessage,
        lecturer: selectedEvent?.extendedProps.worker_title || "N/A",
        login: selectedEvent?.extendedProps.login || "Guest",
        room: selectedEvent?.extendedProps.room || "Unknown",
        lessonId: selectedLessonId,
        group: selectedEvent?.extendedProps.group_name || "Unknown",
        createdAt: localTime,
      };

      console.log("Sending message:", message);

      try {
        await createMessage(message);
        const updatedMessages = await fetchMessages(selectedLessonId);
        setMessages(updatedMessages);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      await deleteMessage(id);
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
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
  }, [teacher, currentDates]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(siteUrl + ':5000/api/auth/check-login', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setLogin(data.login); // Zaktualizuj stan loginu
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    checkLoginStatus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
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

  return (
    <div className="lecturer-calendar">
      <div className={`main-content ${isSidebarOpen ? 'shrink' : ''}`}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]} // Dodano listPlugin
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
          slotMaxTime="21:00:00"
          windowResize={handleWindowResize} // Dodano obsługę zmiany rozmiaru okna
        />
      </div>
      {/* Sidebar */}
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
              {/* <p><strong>Opis:</strong> {selectedEvent.extendedProps.description}</p> */}
              {/*<p><strong>Prowadzący:</strong> {selectedEvent.extendedProps.worker_title}</p>*/}
              <p><strong>Sala:</strong> {selectedEvent.extendedProps.room}<strong>  Grupa:</strong> {selectedEvent.extendedProps.group_name}</p>
              {/* <p><strong>Status zajęć:</strong> {selectedEvent.extendedProps.lesson_status}</p> */}
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
                    {login === lessonLogin && (
                    <button className="delete-btn" onClick={() => handleDeleteMessage(msg.id)}>
                      <FaTrashAlt />
                    </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {login === lessonLogin && (
              <>
            <input
              type="text"
              placeholder="Chat..."
              className="sidebarChatInput"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="sidebarChatButton" onClick={handleSendMessage}>Wyślij</button>
            </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}