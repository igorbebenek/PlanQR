import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import './MyCalendar.css';
import plLocale from '@fullcalendar/core/locales/pl';
import { useParams } from 'react-router-dom';

const events = [
  {
    title: 'Inżynierski projekt zespołowy 1 (P)',
    start : '2025-01-02T08:30:00',
    end: '2025-01-02T11:30:00',
  },
];

export default function MyCalendar() {
  const { department , room } = useParams();
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
        titleFormat={({ start, end }) => {
          // Преобразуем start и end
          const startDate = new Date(start.marker);
          const endDate = end ? new Date(end.marker) : startDate;
          // Преобразуем department и room в верхний регистр
          const departmentUpper = department?.toUpperCase() || '';
          const roomUpper = room?.toUpperCase() || '';
          // Возвращаем форматированный заголовок
          return `${startDate.toLocaleDateString('pl-PL')} – ${endDate.toLocaleDateString('pl-PL')} ${departmentUpper} ${roomUpper}`;
        }}
        
      />
    </>
  );
};
