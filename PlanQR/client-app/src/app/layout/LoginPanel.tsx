import "../layout/style.css"; 
import logo from "../../assets/ZUT_Logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const siteUrl = import.meta.env.VITE_SITE_URL;

export default function LoginPanel() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const checkLoginStatus = async () => {
        try {
          // const token = localStorage.getItem("token");
          // if (!token) {
          //   // console.log("User is unauthorized (token is NULL)");
          //   return;
          // }
          const response = await fetch(siteUrl + ':5000/api/auth/check-login', {
            method: 'GET',
            credentials: 'include',
          });
          if(response.ok){
            const data = await response.json();
            const { givenName, surname } = data;
            const fullName = `${surname} ${givenName}`;
            const encodedFullName = encodeURIComponent(fullName);
            navigate(`/LecturerPlan/${encodedFullName}`);
          }
        } catch (error) {
            console.log(error);
        }
      };

      checkLoginStatus();
    }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(siteUrl + ':5000/api/auth/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: login, password }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const { givenName, surname, title } = data;
        const fullName = `${surname} ${givenName}`;
        const encodedFullName = encodeURIComponent(fullName);
        navigate(`/LecturerPlan/${encodedFullName}`);
      } else {
        alert("Invalid username or password");
      }


    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
      navigate("/");
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