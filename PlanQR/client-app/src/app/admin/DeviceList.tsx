import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the type for a device
interface Device {
  id: number;
  deviceName: string;
  deviceClassroom: string;
  deviceURL: string;
}

const DeviceList = () => {
  const [devices, setDevices] = useState<Device[]>([]); 

  const fetchDevices = async () => {
    try {
      const response = await axios.get('https://planqr.wi.zut.edu.pl:5000/api/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Błąd przy pobieraniu urządzeń:', error);
    }
  };
  

  const deleteDevice = async (id: number) => { 
    if (!window.confirm('Czy na pewno usunąć urządzenie?')) return;
    try {
      await axios.delete(`https://plan.zut.edu.pl:5000/api/devices/${id}`);
      fetchDevices();
    } catch (error) {
      console.error('Błąd przy usuwaniu urządzenia:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div>
      <h2>Lista urządzeń</h2>
      <ul>
  {Array.isArray(devices) ? (
    devices.map(device => (
      <li key={device.id}>
        <strong>{device.deviceName}</strong> — {device.deviceClassroom}
        <br />
        <small>URL: {device.deviceURL}</small><br />
        <button onClick={() => deleteDevice(device.id)}>Usuń</button>
      </li>
    ))
  ) : (
    <li>Brak urządzeń do wyświetlenia</li>
  )}
</ul>
    </div>
  );
};

export default DeviceList;