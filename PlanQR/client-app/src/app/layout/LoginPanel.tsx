import "../layout/style.css"; 
import logo from "../../assets/ZUT_Logo.png";
import { useState } from "react";

export default function LoginPanel() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("https://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: login, password }),
      });

    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-image">
          <img src={logo} alt="Login" />
        </div>
        <div className="input-group-wrapper">
          <div className="input-group">
            <span className="icon">
              <i className="fas fa-envelope"></i>
            </span>
            <input
              type="text"
              placeholder="Login"
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="icon">
              <i className="fas fa-lock"></i>
            </span>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <button type="submit" className="login-btn">Zaloguj</button>
      </form>
    </div>
  );
}