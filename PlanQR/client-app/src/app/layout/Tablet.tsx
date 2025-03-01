import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Tablet.css';
import { fetchMessages } from '../services/messageService';
import LogoWI from '../../assets/WI.jpg';
import LogoZUT from '../../assets/Logo.png';

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
    ? new Date('2025-03-03')
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
    })
  });

  const [scheduleItems, setScheduleItems] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      const dateToShow = new Date('2025-03-03');
      
      setCurrentDateTime({
        date: dateToShow.toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }),
        time: new Date().toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      });
    }, 1000);

    return () => clearInterval(intervalId);
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
          targetDate = new Date('2025-03-03');
        } else if (dateParam) {
          targetDate = new Date(dateParam);
          if (isNaN(targetDate.getTime())) {
            throw new Error('Nieprawidłowy format daty');
          }
        } else {
          // Tu można zmienić, by pokazywało dzisiejszą datę
          // targetDate = new Date();
          targetDate = new Date('2025-03-03');
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
            notifications: messages.map((msg: { body: string }) => msg.body)
          } as ScheduleEvent;
        }));

        console.log("Sformatowane wydarzenia:", formattedEvents);
        
        const sortedEvents = formattedEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        setScheduleItems(sortedEvents);
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

  return (
    <div className="tablet-container">
      <div className="header-logos">
        <div className="university-logo-container">
          <img src={LogoZUT} alt="Logo ZUT" className="university-logo" />
        </div>
        <div className="faculty-logo-container">
          <img src={LogoWI} alt="Logo Wydziału Informatyki" className="faculty-logo" />
        </div>
      </div>
  
      <div className="separator-line"></div>
  
      <div className="room-info-container">
        <div className="address">
          <div>ul. Żołnierska 49</div>
          <div>71-210 Szczecin</div>
        </div>
        <div className="room-number">
          {roomInfo.room}
        </div>
        <div className="datetime">
          <div>{currentDateTime.date}</div>
          <div>{currentDateTime.time}</div>
        </div>
      </div>
  
      <div className="separator-line"></div>
  
      {isLoading ? (
        <div className="loading">Ładowanie planu zajęć...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : scheduleItems.length === 0 ? (
        <div className="no-classes">Brak zajęć na dzisiaj</div>
      ) : (
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="column-time">Godzina</th>
              <th className="column-description">Opis</th>
              <th className="column-notifications">Powiadomienia</th>
            </tr>
          </thead>
          <tbody>
            {scheduleItems.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="column-time">
                  {item.startTime}<br />
                  -<br />
                  {item.endTime}
                </td>
                <td className="column-description">
                  <div className="course-name">{item.description}</div>
                  <div className="instructor">{item.instructor}</div>
                  <div className="room-code">{item.room}</div>
                </td>
                <td className="column-notifications">
                  {Array.isArray(item.notifications) && item.notifications.length > 0 ? (
                    item.notifications.map((notification: string, i: number) => (
                      <div key={i} className="notification">{notification}</div>
                    ))
                  ) : (
                    <div className="notification">Brak powiadomień</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}