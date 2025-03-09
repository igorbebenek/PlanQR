import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Tablet.css';
import { fetchMessages } from '../services/messageService';
import LogoZUT from '../../assets/Logo.png';

// Import all faculty logos
import LogoWI from '../../assets/WI.jpg';
// You'll need to add the actual logo imports for other faculties

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

interface FacultyInfo {
  code: string;
  name: string;
  logo: string;
  address: string;
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
  const [currentFaculty, setCurrentFaculty] = useState<FacultyInfo | null>(null);
  
  // Dodaj mapowanie między formatami wydziałów
  const facultyCodeMapping: Record<string, string> = {
    'WI': 'wi',       // Wydział Informatyki
    'RYB': 'wnozir',  // Wydział Nauk o Żywności i Rybactwa
    'EKON': 'we',     // Wydział Ekonomiczny
    'WE': 'we',       // Wydział Ekonomiczny (alternatywny kod)
    'ARB': 'wa',      // Wydział Architektury
    'WA': 'wa',       // Wydział Architektury (alternatywny kod)
    'BHIMM': 'wbihz', // Wydział Biotechnologii i Hodowli Zwierząt
    'WBIHZ': 'wbihz', // Wydział Biotechnologii i Hodowli Zwierząt (alternatywny kod)
    'BIIS': 'wbis',   // Wydział Budownictwa i Inżynierii Środowiska
    'EL': 'we2',      // Wydział Elektryczny
    'IMIM': 'wimim',  // Wydział Inżynierii Mechanicznej i Mechatroniki
    'KSR': 'wksir',   // Wydział Kształtowania Środowiska i Rolnictwa
    'TICH': 'wtich',  // Wydział Technologii i Inżynierii Chemicznej
    'TMIT': 'wtmit'   // Wydział Techniki Morskiej i Transportu
  };

  const faculties: Record<string, FacultyInfo> = {
    'wi': {
      code: 'wi',
      name: 'Wydział Informatyki',
      logo: LogoWI,
      address: 'ul. Żołnierska 49, 71-210 Szczecin'
    },
    'wbihz': {
      code: 'wbihz',
      name: 'Wydział Biotechnologii i Hodowli Zwierząt',
      logo: LogoWI, // Replace with actual logo
      address: 'ul. Doktora Judyma 6, 71-466 Szczecin'
    },
    'wa': {
      code: 'wa',
      name: 'Wydział Architektury',
      logo: LogoWI, // Replace with actual logo
      address: 'ul. Żołnierska 50, 71-210 Szczecin'
    },
    'we': {
      code: 'we',
      name: 'Wydział Ekonomiczny',
      logo: LogoWI, // Replace with actual logo
      address: 'ul. Żołnierska 47, 71-210 Szczecin'
    },
    'wbis': {
      code: 'wbis',
      name: 'Wydział Budownictwa i Inżynierii Środowiska',
      logo: LogoWI, // Replace with actual logo
      address: 'al. Piastów 50, 70-311 Szczecin'
    },
    'we2': {
      code: 'we2',
      name: 'Wydział Elektryczny',
      logo: LogoWI, // Replace with actual logo
      address: 'ul. 26 Kwietnia 10, 71-126 Szczecin'
    },
    'wimim': {
      code: 'wimim',
      name: 'Wydział Inżynierii Mechanicznej i Mechatroniki',
      logo: LogoWI, // Replace with actual logo
      address: 'al. Piastów 19, 70-310 Szczecin'
    },
    'wnozir': {
      code: 'wnozir',
      name: 'Wydział Nauk o Żywności i Rybactwa',
      logo: LogoWI, // Replace with actual logo
      address: 'ul. Papieża Pawła VI 3, 71-459 Szczecin'
    },
    'wksir': {
      code: 'wksir',
      name: 'Wydział Kształtowania Środowiska i Rolnictwa',
      logo: LogoWI, // Replace with actual logo
      address: 'ul. Słowackiego 17, 71-434 Szczecin'
    },
    'wtich': {
      code: 'wtich',
      name: 'Wydział Technologii i Inżynierii Chemicznej',
      logo: LogoWI, // Replace with actual logo
      address: 'al. Piastów 42, 71-065 Szczecin'
    },
    'wtmit': {
      code: 'wtmit',
      name: 'Wydział Techniki Morskiej i Transportu',
      logo: LogoWI, // Replace with actual logo
      address: 'al. Piastów 41, 71-065 Szczecin'
    }
  };
  
  useEffect(() => {
    const parseRoomInfo = () => {
      if (params.department && params.room) {
        const departmentParam = decodeURIComponent(params.department);
        const roomParam = decodeURIComponent(params.room);
        
        // Określ format sali na podstawie wydziału
        const isWERoom = departmentParam.toUpperCase() === 'WE';
        const isWARoom = departmentParam.toUpperCase() === 'WA' || departmentParam.toUpperCase() === 'ARB';
        const isWBiHZRoom = departmentParam.toUpperCase() === 'WBIHZ' || departmentParam.toUpperCase() === 'BHIMM';
        
        // Dostosuj parametry pokoju i wydziału na podstawie formatu
        let mappedDepartment = departmentParam;
        let mappedRoom = roomParam;
        
        // Dla sal WE, jeśli sala nie zaczyna się od "WE ", dodaj prefix WE
        if (isWERoom && !roomParam.startsWith("WE ")) {
            // Dodaj prefix WE do sali, aby odpowiadała formatowi z plan.zut.edu.pl
            mappedRoom = `WE ${roomParam}`;
            console.log("Dostosowano format sali WE:", mappedRoom);
        }
        
        // Dla sal Wydziału Architektury, format typu "WA 214"
        if (isWARoom && !roomParam.startsWith("WA ")) {
            // Jeśli to numer sali bez prefiksu, dodaj prefiks WA
            if (/^\d+$/.test(roomParam)) {
                mappedRoom = `WA ${roomParam}`;
                console.log("Dostosowano format sali WA:", mappedRoom);
            }
        }
        
        // Dla sal WBiHZ, format może być złożony, np. "1WBiHZ J 32 WYBIEG 02"
        if (isWBiHZRoom) {
            // Jeśli sala już zaczyna się od prefiksu WBiHZ, zostawiamy jak jest
            if (!roomParam.includes("WBiHZ")) {
                // Dla prostych numerów sal, dodaj prefiks
                if (/^\d+$/.test(roomParam)) {
                    mappedRoom = `WBiHZ ${roomParam}`;
                    console.log("Dostosowano format sali WBiHZ:", mappedRoom);
                }
            }
        }
        
        // Przeszukaj mapowanie, aby znaleźć odpowiedni kod wydziału
        for (const [planCode, ourCode] of Object.entries(facultyCodeMapping)) {
          if (departmentParam.toUpperCase().includes(planCode)) {
            mappedDepartment = ourCode;
            break;
          }
        }
        
        // Formatuj parametry zgodnie z konwencją używaną przez plan.zut.edu.pl
        if (isWERoom) {
          // Dla sali Wydziału Ekonomicznego typu "WE WE-A 05"
          // building pozostaje "WE", a room to pełna ścieżka z podwójnym WE
          setRoomInfo({
            building: "WE", // Używamy kodu wydziału zgodnego z plan.zut.edu.pl
            room: mappedRoom // Używamy sali z dodanym prefixem WE jeśli był potrzebny
          });
          
          console.log("Sala Wydziału Ekonomicznego:", {
            building: "WE",
            room: mappedRoom
          });
        } else if (isWARoom) {
          // Dla sali Wydziału Architektury
          setRoomInfo({
            building: "WA", // Używamy kodu WA dla Wydziału Architektury
            room: mappedRoom // Używamy sali z dodanym prefixem WA jeśli był potrzebny
          });
          
          console.log("Sala Wydziału Architektury:", {
            building: "WA",
            room: mappedRoom
          });
        } else if (isWBiHZRoom) {
          // Dla sali Wydziału Biotechnologii i Hodowli Zwierząt
          setRoomInfo({
            building: "WBIHZ", // Używamy kodu WBIHZ
            room: mappedRoom
          });
          
          console.log("Sala Wydziału Biotechnologii i Hodowli Zwierząt:", {
            building: "WBIHZ",
            room: mappedRoom
          });
        } else {
          // Standardowy format dla innych sal
          setRoomInfo({
            building: departmentParam,
            room: roomParam
          });
        }
        
        // Determine faculty from department code
        const departmentCode = mappedDepartment.toLowerCase();
        console.log("Mapped department code:", departmentCode);
        
        // Check exact match first
        if (faculties[departmentCode]) {
          setCurrentFaculty(faculties[departmentCode]);
        } else {
          // Look for partial matches
          const matchedFaculty = Object.values(faculties).find(faculty => 
            departmentCode.includes(faculty.code)
          );
          
          if (matchedFaculty) {
            setCurrentFaculty(matchedFaculty);
          } else {
            // Default to WI if no match found
            setCurrentFaculty(faculties['wi']);
          }
        }
        
        return;
      }
      
      const pathParts = location.pathname.split('/');
      
      if (pathParts.length >= 4) {
        const departmentCode = pathParts[2].toLowerCase(); 
        const roomPart = decodeURIComponent(pathParts[3]);
        
        // Determine faculty from department code
        if (faculties[departmentCode]) {
          setCurrentFaculty(faculties[departmentCode]);
        } else {
          // Look for partial matches
          const matchedFaculty = Object.values(faculties).find(faculty => 
            departmentCode.includes(faculty.code)
          );
          
          if (matchedFaculty) {
            setCurrentFaculty(matchedFaculty);
          } else {
            // Default to WI if no match found
            setCurrentFaculty(faculties['wi']);
          }
        }
        
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
        
        // Określ format sali na podstawie wydziału
        const isWERoom = roomInfo.building.toUpperCase() === 'WE';
        const isWARoom = roomInfo.building.toUpperCase() === 'WA';
        const isWBiHZRoom = roomInfo.building.toUpperCase() === 'WBIHZ';
        
        // Dostosuj URL w zależności od typu sali
        let url;
        if (isWERoom) {
          // Dla sal Wydziału Ekonomicznego używamy specjalnego formatu
          // Format URL: /schedule_student.php?department=WE&room=WE%20WE-A%2005
          url = `/schedule_student.php?department=${encodeURIComponent(roomInfo.building)}&room=${encodeURIComponent(roomInfo.room)}&start=${formattedDate}&end=${nextDayFormatted}`;
          console.log("URL dla Wydziału Ekonomicznego:", url);
        } else if (isWARoom) {
          // Dla sal Wydziału Architektury
          url = `/schedule_student.php?department=${encodeURIComponent(roomInfo.building)}&room=${encodeURIComponent(roomInfo.room)}&start=${formattedDate}&end=${nextDayFormatted}`;
          console.log("URL dla Wydziału Architektury:", url);
        } else if (isWBiHZRoom) {
          // Dla sal Wydziału Biotechnologii i Hodowli Zwierząt
          url = `/schedule_student.php?department=${encodeURIComponent(roomInfo.building)}&room=${encodeURIComponent(roomInfo.room)}&start=${formattedDate}&end=${nextDayFormatted}`;
          console.log("URL dla Wydziału Biotechnologii i Hodowli Zwierząt:", url);
        } else {
          // Standardowy format dla innych sal
          url = `/schedule_student.php?kind=apiwi&department=${encodeURIComponent(roomInfo.building)}&room=${encodeURIComponent(roomInfo.room)}&start=${formattedDate}&end=${nextDayFormatted}`;
        }
        
        console.log("Pobieranie planu zajęć z URL:", url);
        
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error('Nie udało się pobrać planu zajęć');
          
          // Dodaj dodatkowe logowanie dla debugowania
          console.log("Status odpowiedzi:", response.status);
          console.log("Headers odpowiedzi:", response.headers);
          
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
          
          // Spróbuj alternatywny format URL, jeśli pierwszy nie zadziałał
          try {
            // Określ, czy mamy do czynienia z formatem sali WE
            const isWERoom = roomInfo.building.toUpperCase() === 'WE' && roomInfo.room.includes('WE-');
            
            // Alternatywny format URL z plan.zut.edu.pl
            let altUrl;
            if (isWERoom) {
              // Spróbuj innego formatu zapytania dla Wydziału Ekonomicznego
              altUrl = `/schedule_student.php?kind=apiwi&department=${encodeURIComponent(roomInfo.building)}&room=${encodeURIComponent(roomInfo.room)}&start=${formattedDate}&end=${nextDayFormatted}`;
            } else {
              // Standardowy alternatywny format
              altUrl = `/schedule_student.php?kind=apisl&department=${encodeURIComponent(roomInfo.building)}&room=${encodeURIComponent(roomInfo.room)}&start=${formattedDate}&end=${nextDayFormatted}`;
            }
            
            console.log("Próba alternatywnego URL:", altUrl);
            
            const response = await fetch(altUrl);
            if (!response.ok) throw new Error('Nie udało się pobrać planu zajęć alternatywnym sposobem');
            
            const data = await response.json();
            console.log("Otrzymane dane z alternatywnego URL:", data);
            
            const targetDateString = targetDate.toDateString();
            const targetEvents = data.filter((event: any) => {
              const eventDate = new Date(event.start);
              return eventDate.toDateString() === targetDateString;
            });
            
            const formattedEvents = await Promise.all(targetEvents.map(async (event: any) => {
              // Pozostała logika formatowania wydarzeń jest taka sama
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

            const sortedEvents = formattedEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
            
            setScheduleItems(sortedEvents);
            setIsLoading(false);
            setError(null);
            return;
          } catch (altError) {
            console.error('Nie udało się pobrać planu również alternatywnym sposobem:', altError);
          }
          
          setScheduleItems([]);
          setError('Nie udało się pobrać planu zajęć. Sprawdź połączenie z systemem planu zajęć ZUT.');
          setIsLoading(false);
        }
      } catch (outerError) {
        console.error('Błąd zewnętrzny podczas pobierania planu zajęć:', outerError);
        setScheduleItems([]);
        setError('Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.');
        setIsLoading(false);
      }
    };

    fetchSchedule();

    const intervalId = setInterval(fetchSchedule, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [roomInfo.building, roomInfo.room, location.search, hasSpecialDate]);

  // Get address for current faculty or use default
  const currentAddress = currentFaculty?.address || 'ul. Żołnierska 49, 71-210 Szczecin';
  
  // Split address into two lines
  const addressLines = currentAddress.split(', ');

  return (
    <div className="tablet-container">
      <div className="header-logos">
        <div className="university-logo-container">
          <img src={LogoZUT} alt="Logo ZUT" className="university-logo" />
        </div>
        <div className="faculty-logo-container">
          <img 
            src={currentFaculty?.logo || LogoWI} 
            alt={`Logo ${currentFaculty?.name || 'Wydziału Informatyki'}`}
            className="faculty-logo" 
          />
        </div>
      </div>
  
      <div className="separator-line"></div>
  
      <div className="room-info-container">
        <div className="address">
          <div>{addressLines[0]}</div>
          <div>{addressLines[1]}</div>
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