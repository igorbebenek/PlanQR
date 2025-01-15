import { Button, Menu } from 'semantic-ui-react';
import img from '../../assets/ZUT_Logo.png';
import './NavBar.css';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
export default function NavBar() {
  const { room , teacher } = useParams();
  return (
    <Menu inverted fixed="top" className="navbar">
      <Menu.Item className="navbar-logo">
        <img src={img} alt="logo" />
      </Menu.Item>
      <Menu.Item className="room-name">
        <p><strong>{room ? room : teacher}</strong></p>
      </Menu.Item>
      <Menu.Menu position="right" className="navbar-menu">
        <Menu.Item>
          <Button as={NavLink} to="/" color="blue" className="navbar-login-btn"> Logowanie </Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};