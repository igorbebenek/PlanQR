import { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css'; // Import the CSS file for styling

// Define the type for a device
interface Device {
  id: number;
  deviceName: string;
  deviceClassroom: string;
  deviceURL: string;
}

const DeviceList = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const [devices, setDevices] = useState<Device[]>([]); 

  const fetchDevices = async () => {
    try {
      const response = await axios.get(siteUrl + ':5000/api/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Błąd przy pobieraniu urządzeń:', error);
    }
  };
  

  const deleteDevice = async (id: number) => { 
    if (!window.confirm('Czy na pewno usunąć urządzenie?')) return;
    try {
      await axios.delete(siteUrl + `:5000/api/devices/${id}`);
      fetchDevices();
    } catch (error) {
      console.error('Błąd przy usuwaniu urządzenia:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
<div className="device-list">
  <h2>Lista urządzeń</h2>
  <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr>
        <th>ID</th>
        <th>Nazwa urządzenia</th>
        <th>Sala</th>
        <th>URL</th>
        <th>Akcje</th>
      </tr>
    </thead>
    <tbody>
      {Array.isArray(devices) && devices.length > 0 ? (
        devices.map(device => (
          <tr key={device.id}>
            <td>{device.id}</td>
            <td>{device.deviceName}</td>
            <td>{device.deviceClassroom}</td>
            <td>
              <a href={device.deviceURL} target="_blank" rel="noopener noreferrer">
                {device.deviceURL}
              </a>
            </td>
            <td>
              <button onClick={() => deleteDevice(device.id)}>Usuń</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} style={{ textAlign: 'center' }}>
            Brak urządzeń do wyświetlenia
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
  );
};

export default DeviceList;