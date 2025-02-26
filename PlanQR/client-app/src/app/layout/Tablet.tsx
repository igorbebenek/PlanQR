import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import NavBar from "../layout/NavBar";
import './Tablet.css';

import LogoWI from '../../assets/WI.jpg';
import LogoZUT from '../../assets/Logo.png'


export default function Tablet() {
    const { building, room } = useParams();
    const location = useLocation();
    
    const [roomInfo, setRoomInfo] = useState({
      building: building || "WI WI1",
      room: room || "308"
    });
    
    useEffect(() => {
      if (building && room) {
        setRoomInfo({
          building: building,
          room: room
        });
      } else {
        const pathParts = location.pathname.split('/');
        if (pathParts.length >= 4) {
          const facultyCode = pathParts[2]; 
          const roomPart = pathParts[3];
          
          const roomMatch = roomPart.match(/(.+)-\s*(\d+)/);
          if (roomMatch && roomMatch.length >= 3) {
            setRoomInfo({
              building: roomMatch[1].trim(),
              room: roomMatch[2].trim()
            });
          }
        }
      }
    }, [building, room, location]);
  
    const [currentDateTime, setCurrentDateTime] = useState({
      date: new Date().toLocaleDateString('pl-PL', {
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
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentDateTime({
          date: new Date().toLocaleDateString('pl-PL', {
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
  
    const scheduleItems = [
      {
        startTime: "8:30",
        endTime: "11:30",
        description: "Inżynierski projekt zespołowy 1 (P)",
        instructor: "dr inż. Grzegorz Śliwiński",
        room: "S1_I_Ipz1_312",
        notifications: ["Spóźnię się 10 minut", "Zacznijcie wykonywać laboratorium"]
      },
      {
        startTime: "12:15",
        endTime: "14:00",
        description: "Sieci komputerowe (L)",
        instructor: "dr inż. Grzegorz Śliwiński",
        room: "S1_I_L_332",
        notifications: ["Brak powiadomień"]
      }
    ];

    return (
      <div className="tablet-container">
        <div className="header-logos">
    <div className="university-logo-container">
        <img src={LogoZUT} alt="Logo ZUT" className="university-logo" style={{ width: '180px', height: 'auto' }} />
    </div>
    <div className="faculty-logo-container">
        <img src={LogoWI} alt="Logo Wydziału Informatyki" className="faculty-logo" style={{ width: '180px', height: 'auto' }} />
    </div>
    </div>
  
        <div className="separator-line"></div>
  
        <div className="room-info-container">
          <div className="address">
            <div>ul. Żołnierska 49</div>
            <div>71-210 Szczecin</div>
          </div>
          <div className="room-number">
            {roomInfo.building} {roomInfo.room}
          </div>
          <div className="datetime">
            <div>{currentDateTime.date}</div>
            <div>{currentDateTime.time}</div>
          </div>
        </div>
  
        <div className="separator-line"></div>
  
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
                  {Array.isArray(item.notifications) && item.notifications.map((notification, i) => (
                    <div key={i} className="notification">{notification}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
      </div>
    );
}