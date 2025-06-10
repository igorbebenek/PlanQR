import { Button, Menu } from 'semantic-ui-react';
import img from '../../assets/ZUT_Logo.png';
import './NavBar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const siteUrl = import.meta.env.VITE_SITE_URL;

export default function NavBar() {
  const { room, teacher } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(siteUrl + ':5000/api/auth/check-login', {
          method: 'GET',
          credentials: 'include',
        });
        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(siteUrl + ':5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        navigate('/');
      } else {
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  return (
    <Menu inverted fixed="top" className="navbar">
    <Menu.Item className="navbar-logo">
      <a href={siteUrl}>
        <img src={img} alt="logo" />
      </a>
    </Menu.Item>
      <Menu.Item className="room-name">
        <p><strong>{room || teacher}</strong></p>
      </Menu.Item>
      <Menu.Menu position="right" className="navbar-menu">
      <Menu.Item>
  {room ? null : (
    isLoggedIn ? (
      <button onClick={handleLogout} color="red" className="navbar-login-btn-exit">
        Wyloguj
      </button>
    ) : (
      <Button as={NavLink} to="/" color="blue" className="navbar-login-btn">
        Logowanie
      </Button>
    )
  )}
</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
}