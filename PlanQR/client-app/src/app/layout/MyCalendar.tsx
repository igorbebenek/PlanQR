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

export default function MyCalendar() {
  const { department, room } = useParams();
  const [events, setEvents] = useState([]); 
  const [currentDates, setCurrentDates] = useState({ start: '', end: '' });

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
      })));

      console.log('Fetched events:', data); 
    } catch (error) {
      console.error('Error fetching events:', error);
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
  }, [department, room, currentDates]);

  return (
    <>
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
        slotMinTime="07:00:00"
      />
    </>
  );
}