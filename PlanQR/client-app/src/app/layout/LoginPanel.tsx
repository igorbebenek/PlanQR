import "../layout/style.css"; 
import logo from "../../assets/ZUT_Logo.png";

export default function LoginPanel() {
  return (
    <div className="login-container">
      <form className="login-form">
        <div className="login-image">
          <img src={logo} alt="Login" />
        </div>
        <div className="input-group-wrapper">
          <div className="input-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>
        </div>
        <button type="submit" className="login-btn">Zaloguj</button>
      </form>
    </div>
  );
};