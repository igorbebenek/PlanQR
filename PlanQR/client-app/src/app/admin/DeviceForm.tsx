import { useState } from 'react';
import axios from 'axios';

const DeviceForm = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL;
  const [deviceName, setDeviceName] = useState('');
  const [deviceClassroom, setDeviceClassroom] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(siteUrl + ':5000/api/devices', {
        deviceName,
        deviceClassroom,
      });
      setDeviceName('');
      setDeviceClassroom('');
      window.location.reload();
    } catch (error) {
      console.error('Błąd przy dodawaniu urządzenia:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dodaj nowe urządzenie</h2>
      <div>
        <label>Nazwa:</label><br />
        <input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} required />
      </div>
      <div>
        <label>Sala:</label><br />
        <input value={deviceClassroom} onChange={(e) => setDeviceClassroom(e.target.value)} required />
      </div>
      <button type="submit">Dodaj</button>
    </form>
  );
};

export default DeviceForm;
