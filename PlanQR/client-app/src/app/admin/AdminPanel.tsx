import DeviceForm from "./DeviceForm";
import DeviceList from "./DeviceList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allowedLogins } from './adminConfig.ts';

const AdminPanel = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL;
  
  const [login, setLogin] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Dodano stan ładowania
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(siteUrl + ':5000/api/auth/check-login', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setLogin(data.login); // Zaktualizuj stan loginu
        } else {
          navigate('/login'); // Przekieruj na stronę logowania, jeśli nie zalogowany
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        navigate('/login'); // Przekieruj na stronę logowania w przypadku błędu
      } finally {
        setIsLoading(false); // Ustaw zakończenie ładowania
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch(siteUrl + ':5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/'); // Przekieruj na stronę logowania po wylogowaniu
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Ładowanie...</div>; // Wyświetl komunikat ładowania
  }

  if (!login) {
    navigate('/');
  }

  if (!allowedLogins.includes(login || '')) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Nie masz dostępu do tego panelu.</h2>
        <p>Zalogowany jako: <strong>{login}</strong></p>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
          Wyloguj
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Panel zarządzania urządzeniami</h1>
      <button onClick={handleLogout}>Wyloguj</button>
      <DeviceForm />
      <hr />
      <DeviceList />
    </div>
  );
};

export default AdminPanel;