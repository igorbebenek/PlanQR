import './App.css'
import '../src/app/layout/LoginPanel'
import { Outlet, useLocation } from 'react-router-dom';
import LoginPanel from '../src/app/layout/LoginPanel';

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === '/' ? <LoginPanel /> : (<Outlet />)}
    </>
  )
}

export default App
