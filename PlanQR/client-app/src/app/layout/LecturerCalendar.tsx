import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import plLocale from '@fullcalendar/core/locales/pl';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { EventApi, EventClickArg } from '@fullcalendar/core';
import { fetchMessages, createMessage } from "../services/messageService";

export default function LecturerCalendar() {
  const { teacher } = useParams();
  const [events, setEvents] = useState([]);
  const [currentDates, setCurrentDates] = useState({ start: '', end: '' });

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

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
    console.log("Clicked event:", event.extendedProps); // Лог для перевірки

    setSelectedEvent(event);
    const lessonId = event.extendedProps.id;

    if (lessonId) {
      setSelectedLessonId(lessonId); // Встановлюємо lessonId
      fetchMessages(lessonId) // Викликаємо API
        .then(setMessages)
        .catch((err) => console.error("Error fetching messages:", err));
    } else {
      console.error("Lesson ID is missing!");
    }

    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSelectedEvent(null); // Wyczyść dane wydarzenia
    setIsSidebarOpen(false);
  };


  const handleSendMessage = async () => {
    if (selectedLessonId && newMessage.trim() !== "") {
      const message = {
        body: newMessage,
        lecturer: selectedEvent?.extendedProps.worker_title || "N/A",
        login: selectedEvent?.extendedProps.login || "Guest",
        room: selectedEvent?.extendedProps.room || "Unknown",
        lessonId: selectedLessonId,
        group: selectedEvent?.extendedProps.group_name || "Unknown",
        createdAt: new Date().toISOString(),
      };

      console.log("Sending message:", message);

      try {
        const sentMessage = await createMessage(message);
        setMessages([...messages, sentMessage]); // Додаємо нове повідомлення в UI
        setNewMessage(""); // Очищаємо поле вводу
      } catch (error) {
        console.error("Error sending message:", error);
      }
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

  return (
    <div className="lecturer-calendar">
      <div className={`main-content ${isSidebarOpen ? 'shrink' : ''}`}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
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
            const content = `${info.event.title} , prowadzący ${info.event.extendedProps.worker_title}, sala ${info.event.extendedProps.room}, grupa ${info.event.extendedProps.group_name} - ${info.event.extendedProps.lesson_status}`;
            tippy(info.el, {
              content: content,
              placement: 'top',
              trigger: 'mouseenter',
              theme: 'custom-yellow',
            });
          }}
          eventClick={handleEventClick}
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
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
              <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
              {/*<p><strong>Opis:</strong> {selectedEvent.extendedProps.description}</p>*/}
              <p><strong>Prowadzący:</strong> {selectedEvent.extendedProps.worker_title}</p>
              <p><strong>Sala:</strong> {selectedEvent.extendedProps.room}</p>
              <p><strong>Grupa:</strong> {selectedEvent.extendedProps.group_name}</p>
              {/*<p><strong>Status zajęć:</strong> {selectedEvent.extendedProps.lesson_status}</p>*/}
            </div>
          ) : (
            <p>Brak szczegółów wydarzenia</p>
          )}
          <div className="sidebarChat">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  <p><strong>{msg.login}:</strong> {msg.body}</p>
                  <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Invalid Date"}</span>
                </div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Chat..."
              className="sidebarChatInput"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="sidebarChatButton" onClick={handleSendMessage}>Wyślij</button>
          </div>
        </div>
      )}
    </div>
  );
}