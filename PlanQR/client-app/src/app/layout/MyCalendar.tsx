import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MyCalendar.css';

const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Inżynierski projekt zespołowy 1 (P)',
    start: new Date(2024, 11, 6, 8, 30), // 6 декабря 2024, 8:30
    end: new Date(2024, 11, 6, 11, 30),  // 6 декабря 2024, 11:30
  },
  {
    title: 'Пример встречи',
    start: new Date(2024, 11, 7, 13, 0), // 7 декабря 2024, 13:00
    end: new Date(2024, 11, 7, 14, 0),  // 7 декабря 2024, 14:00
  },
];

const MyCalendar = () => {
  return (
    <div style={{ height: '80vh', margin: '20px auto', width: '90%' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week" // Вид "неделя"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default MyCalendar;
