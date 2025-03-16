import './App.css';
import '../src/app/layout/LoginPanel';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import LoginPanel from '../src/app/layout/LoginPanel';
import { useEffect } from 'react';

const siteUrl = import.meta.env.VITE_SITE_URL;

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: number;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        handleLogout();
      }, 60 * 60 * 1000); // 60 minut
    };

    const handleLogout = async () => {
      try {
        const response = await fetch(siteUrl + ":5000/api/auth/logout", {
          method: "POST",
          credentials: "include"
        });

        if (response.ok) {
          navigate("/");
        } else {
          alert("Logout failed");
        }
      } catch (error) {
        console.error("Error during logout:", error);
        alert("An error occurred during logout. Please try again.");
      }
    };

    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
    };
  }, [navigate]);

  return (
    <>
      {location.pathname === '/' ? <LoginPanel /> : (<Outlet />)}
    </>
  );
}

export default App;