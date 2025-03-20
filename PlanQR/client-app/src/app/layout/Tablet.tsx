import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Tablet.css';
import { fetchMessages } from '../services/messageService';
import LogoWI from '../../assets/WI.jpg';
import LogoZUT from '../../assets/ZUT_Logo.png';
import QRcode from '../../assets/wiwi1-308.png';

interface ScheduleEvent {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
  instructor: string;
  room: string;
  group_name: string;
  login: string;
  notifications: string[];
  color: string;
}

export default function Tablet() {
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
    const fixedDate = new Date();
    
    setCurrentDateTime({
      date: fixedDate.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: fixedDate.toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      dayName: fixedDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dayNumber: fixedDate.getDate()
    });
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
            color: event.color || '#039be5'
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
    const currentTimeValue = 9;
    
    const startHour = parseInt(event.startTime.split(':')[0]);
    const startMinute = parseInt(event.startTime.split(':')[1]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const endMinute = parseInt(event.endTime.split(':')[1]);
    
    const startTimeValue = startHour + startMinute / 60;
    const endTimeValue = endHour + endMinute / 60;
    
    return currentTimeValue >= startTimeValue && currentTimeValue < endTimeValue;
  };

  const getEventType = (event: ScheduleEvent) => {
    const description = event.description.toLowerCase();
    
    if (description.includes('laboratorium') || description.includes('lab')) {
      return 'laboratorium';
    } else if (description.includes('lektorat') || description.includes('język')) {
      return 'lektorat';
    } else if (description.includes('seminarium')) {
      return 'seminarium';
    } else if (description.includes('wykład') || description.includes('systemy')) {
      return 'wyklad';
    } else if (description.includes('projekt')) {
      return 'projekt';
    } else if (description.includes('audytoryjne')) {
      return 'audytoryjne';
    } else {
      return 'zastepstwo'; 
    }
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
    // Fixed at 14:00
    const currentTime = new Date().getHours();
  
    
    return (currentTime - 8) * 36 + new Date().getMinutes() * 0.6; 
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
                  {/* {currentDateTime.time} */}
                  9:05:23
                  </div>
              </div>
          
              <div className="room-number">
                WI WI1- 308
              </div>
              <div className='qrcode'>
                <img src={QRcode} alt="QR code" className="qrcode" />
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
                className={`calendar-event event-type-${getEventType(event)}`}
                style={{
                  ...getEventStyle(event), // Pozycjonowanie i wysokość
                  backgroundColor: event.color, // Kolor tła z właściwości `color`
                  color: '#fff', // Kolor tekstu (np. biały dla kontrastu)
                }}
                onClick={() => setSelectedEvent(event)}
              >
                {/* <div className="left-disp">
                  <div className="event-time">{event.startTime} 
                    <br></br>- <br></br>
                    {event.endTime}</div>
                    
                </div>
                <div className="right-disp">
                  <div className="right-disp-top">
                <div className="event-title">{event.description}</div>
                    <div className="event-lecturer">{event.instructor}</div>
                  <div className="event-group">{event.group_name}</div>
                 </div>
                 <div className="right-disp-bottom">
                  <div className="event-notification">{event.notifications}</div>
                  </div>
                </div> */}
              </div>
              ))}
              </div>
            </div>
          )}
          
          {/* Legend at the bottom */}
          {/* <div className="calendar-legend">
            <span className="legend-title">Legenda:</span>
            <div className="legend-item">
              <span className="legend-color-box" style={{backgroundColor: '#039be5'}}></span>
              <span className="legend-label">wykład</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box" style={{backgroundColor: '#0f9d58'}}></span>
              <span className="legend-label">laboratorium</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box" style={{backgroundColor: '#4285f4'}}></span>
              <span className="legend-label">zastępstwo</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box" style={{backgroundColor: '#f4b400'}}></span>
              <span className="legend-label">lektorat</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box" style={{backgroundColor: '#996600'}}></span>
              <span className="legend-label">projekt</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box" style={{backgroundColor: '#00796b'}}></span>
              <span className="legend-label">audytoryjne</span>
            </div>
            <div className="legend-item">
              <span className="legend-color-box" style={{backgroundColor: '#8e24aa'}}></span>
              <span className="legend-label">seminarium</span>
            </div>
          </div> */}
        </div>
        
        {/* Right notifications panel */}
        {/* <div className="notifications-panel">
        <div className="notifications-header">
            <h2>Powiadomienia prowadzącego</h2>
          </div>
          
          {selectedEvent ? (
            <div className="notification-content">              
              <div className="notification-list">
                {Array.isArray(selectedEvent?.notifications) && selectedEvent.notifications.length > 0 ? (
                  <div className="notification-items">
                    {selectedEvent.notifications.map((notification, i) => (
                      <div key={i} className="notification-item">{notification}</div>
                    ))}
                  </div>
                ) : (
                  <div className="no-notifications">Brak powiadomień</div>
                )}
              </div>
            </div>
          ) : (
            <div className="select-event-message">Wybierz wydarzenie, aby zobaczyć powiadomienia</div>
          )}
        </div> */}
      </div>
    </div>
  );
}