import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Tablet.css';
import { fetchMessages } from '../services/messageService';
import LogoWI from '../../assets/WI.jpg';
import LogoZUT from '../../assets/ZUT_Logo.png';
import {QRCodeCanvas}  from 'qrcode.react';

interface ScheduleEvent {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
  instructor: string;
  room: string;
  form: string;
  group_name: string;
  login: string;
  notifications: string[];
  color: string;
}

export default function Tablet() {

  useEffect(() => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.classList.add('tablet-mode'); // Dodaj klasę
    }

    return () => {
      if (rootElement) {
        rootElement.classList.remove('tablet-mode'); // Usuń klasę przy odmontowaniu
      }
    };
  }, []);

  const params = useParams<{ department?: string; room?: string }>();
  const location = useLocation();
  
  const [roomInfo, setRoomInfo] = useState({
    building: "",
    room: ""
  });
  
  const showSpecialDateForAll = false;
  const hasSpecialDate = showSpecialDateForAll;
  
  const initialDate = hasSpecialDate
    ? new Date()
    : new URLSearchParams(location.search).get('date') 
      ? new Date(new URLSearchParams(location.search).get('date') || '')
      : new Date();
  
  const [currentDateTime, setCurrentDateTime] = useState({
    date: initialDate.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    time: new Date().toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    dayName: initialDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    dayNumber: initialDate.getDate()
  });

  const [scheduleItems, setScheduleItems] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  
  useEffect(() => {
    const parseRoomInfo = () => {
      if (params.department && params.room) {
        setRoomInfo({
          building: decodeURIComponent(params.department),
          room: decodeURIComponent(params.room)
        });
        return;
      }
      
      const pathParts = location.pathname.split('/');
      
      if (pathParts.length >= 4) {
        const departmentCode = pathParts[2]; 
        const roomPart = decodeURIComponent(pathParts[3]);
        
        const buildingMatch = roomPart.match(/^([^-\d]+)/);
        const roomMatch = roomPart.match(/[-\s]*(\d+)$/);
        
        if (buildingMatch && roomMatch) {
          setRoomInfo({
            building: departmentCode,
            room: roomPart
          });
        } else {
          setRoomInfo({
            building: departmentCode,
            room: roomPart
          });
        }
      }
    };
    
    parseRoomInfo();
  }, [location.pathname, params]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentDateTime({
        date: now.toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        time: now.toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        dayName: now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dayNumber: now.getDate(),
      });
    }, 1000); // Aktualizacja co sekundę
  
    return () => clearInterval(intervalId); // Czyszczenie interwału przy odmontowaniu komponentu
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!roomInfo.building || !roomInfo.room) {
        console.log("Informacje o sali nie są jeszcze dostępne");
        return;
      }
      
      setIsLoading(true);
      
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');
        
        let targetDate;
        if (hasSpecialDate) {
          targetDate = new Date();
        } else if (dateParam) {
          targetDate = new Date(dateParam);
          if (isNaN(targetDate.getTime())) {
            throw new Error('Nieprawidłowy format daty');
          }
        } else {
          // Tu można zmienić, by pokazywało dzisiejszą datę
          // targetDate = new Date();
          targetDate = new Date();
        }
        
        const formattedDate = targetDate.toISOString().split('T')[0];
        
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayFormatted = nextDay.toISOString().split('T')[0];
        
        const url = `/schedule_student.php?kind=apiwi&department=${encodeURIComponent(roomInfo.building)}&room=${encodeURIComponent(roomInfo.room)}&start=${formattedDate}&end=${nextDayFormatted}`;
        
        console.log("Pobieranie planu zajęć z URL:", url);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Nie udało się pobrać planu zajęć');
        
        const data = await response.json();
        console.log("Otrzymane dane planu:", data);
        
        const targetDateString = targetDate.toDateString();
        const targetEvents = data.filter((event: any) => {
          const eventDate = new Date(event.start);
          return eventDate.toDateString() === targetDateString;
        });
        
        console.log("Przefiltrowane wydarzenia na dzisiaj:", targetEvents);

        const formattedEvents = await Promise.all(targetEvents.map(async (event: any) => {
          let messages = [];
          try {
            if (event.id) {
              messages = await fetchMessages(event.id);
            }
          } catch (err) {
            console.error('Błąd podczas pobierania wiadomości dla lekcji:', event.id, err);
          }

          const startTime = new Date(event.start).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
          });
          
          const endTime = new Date(event.end).toLocaleTimeString('pl-PL', {
            hour: '2-digit',
            minute: '2-digit'
          });

          return {
            id: event.id,
            startTime,
            endTime,
            description: event.subject || event.title,
            instructor: event.worker_title || 'Brak informacji',
            room: event.room || 'Brak informacji',
            group_name: event.group_name || '',
            login: event.login || '',
            notifications: messages.map((msg: { body: string }) => msg.body),
            color: event.color || '#039be5',
            form: event.lesson_form_short || '',
          } as ScheduleEvent;
        }));

        console.log("Sformatowane wydarzenia:", formattedEvents);
        
        const sortedEvents = formattedEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        setScheduleItems(sortedEvents);
        if (sortedEvents.length > 0) {
          setSelectedEvent(sortedEvents[0]);
        }
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error('Błąd podczas pobierania planu zajęć:', error);
        setScheduleItems([]);
        setError('Nie udało się pobrać planu zajęć');
        setIsLoading(false);
      }
    };

    fetchSchedule();

    const intervalId = setInterval(fetchSchedule, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [roomInfo.building, roomInfo.room, location.search, hasSpecialDate]);

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    const hourFormatted = hour < 10 ? `0${hour}` : `${hour}`;
    return `${hourFormatted}:00`;
  });
  
  useEffect(() => {
  }, []);
  
  
  

  const isEventCurrent = (event: ScheduleEvent) => {
    const now = new Date();
    const currentTimeValue = now.getHours() + now.getMinutes() / 60; // Aktualny czas w formacie dziesiętnym
  
    const startHour = parseInt(event.startTime.split(':')[0]);
    const startMinute = parseInt(event.startTime.split(':')[1]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const endMinute = parseInt(event.endTime.split(':')[1]);
  
    const startTimeValue = startHour + startMinute / 60;
    const endTimeValue = endHour + endMinute / 60;
  
    return currentTimeValue >= startTimeValue && currentTimeValue < endTimeValue;
  };


  const getEventStyle = (event: ScheduleEvent) => {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const startMinute = parseInt(event.startTime.split(':')[1]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const endMinute = parseInt(event.endTime.split(':')[1]);
  
    const startTime = startHour + startMinute / 60;
    const endTime = endHour + endMinute / 60;
    const duration = endTime - startTime;
  
    const slotHeight = 50; // Nowa wysokość slotu czasu w pikselach
    const topPosition = (startTime - 8) * slotHeight; // Pozycja od godziny 8:00
    const height = duration * slotHeight; // Wysokość eventu
  
    return {
      top: `${topPosition}px`,
      height: `${height}px`,
    };
  };

  const getCurrentTimePosition = () => {
    const currentTime = new Date().getHours(); // Pobiera aktualną godzinę
    return (currentTime - 8) * 50 + new Date().getMinutes() * 0.6; 
  };
  
  const findCurrentEvent = () => {
    const currentEvent = scheduleItems.find(event => isEventCurrent(event));
    return currentEvent;
  };
  
  useEffect(() => {
    if (!isLoading && !error && scheduleItems.length > 0) {
      const currentEvent = findCurrentEvent();
      if (currentEvent) {
        setSelectedEvent(currentEvent);
      } else {
        setSelectedEvent(scheduleItems[0]);
      }
    }
  }, [scheduleItems, isLoading, error]);

  return (
    <div className="tablet-container">
      <div className="calendar-layout">
        {/* Left calendar panel */}
        <div className="calendar-panel">
          <div className="header-container">
            <div className="header-logos">
              <div className="university-logo-container">
                <img src={LogoZUT} alt="Logo ZUT" className="university-logo" />
              </div>
              {/* <div className="faculty-logo-container">
                <img src={LogoWI} alt="Logo Wydziału Informatyki" className="faculty-logo" />
              </div> */}
              
              
            </div>
            
          <div className="room-info-container">
          <div className="datetime-placeholder">
                <div className="time">
                  {currentDateTime.time}
                  </div>
              </div>
          
              <div className="room-number">
                  <span>{roomInfo.room}</span>
              </div>
              <div className='qrcode'>
                <QRCodeCanvas
                value={`https://planqr.wi.zut.edu.pl/${encodeURIComponent(roomInfo.building)}/${encodeURIComponent(roomInfo.room)}`}
                size={100} 
                style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-container">Ładowanie planu zajęć...</div>
          ) : error ? (
            <div className="error-container">{error}</div>
          ) : scheduleItems.length === 0 ? (
            <div className="no-events-container">Brak zajęć na dzisiaj</div>
          ) : (
            <div className="calendar-container">
              {/* Day indicator circle */}
              <div className="day-indicator">
                <div className="day-name">{currentDateTime.dayName}</div>
                <div className="day-circle">{currentDateTime.dayNumber}</div>
              </div>
              
              {/* Calendar grid */}
              <div className="time-grid">
                {/* Time slots */}
                {timeSlots.map((time, index) => (
                  <div key={index} className="time-slot">
                    <div className="time-label">{time}</div>
                    <div className="time-cell"></div>
                  </div>
                ))}
                
                {/* Current time indicator */}
                <div className="current-time-indicator" style={{ top: `${getCurrentTimePosition()}px` }}>
                  <div className="time-circle"></div>
                </div>
                
                {/* Events */}
                {scheduleItems.map((event, index) => (
                <div
                key={index}
                className={`calendar-event ${isEventCurrent(event) ? 'current' : ''}`}
                style={{
                  ...getEventStyle(event),
                  backgroundColor: event.color,
                  color: '#fff',
                }}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="calendar-event-left">
                  <span>{event.startTime}<br /> - <br />{event.endTime}</span>
                </div>
                <div className="calendar-event-right">
                  <div className="event-description">
                    <div className="description-block description-block-1">
                      <span>{event.description} ({event.form})</span>
                    </div>
                    <div className="description-block description-block-2">
                      <span>{event.instructor}</span>
                    </div>
                    <div className="description-block description-block-3">
                      <span>{event.group_name}</span>
                    </div>
                  </div>
                  <div className="event-footer">
                    {event.notifications && event.notifications.length > 0 ? (
                      event.notifications.map((notification, index) => (
                        <div key={index} className="notification-item">
                          {notification}
                        </div>
                      ))
                    ) : (
                      <span>Brak powiadomień</span>
                    )}
                  </div>
                </div>
              </div>
              ))}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}