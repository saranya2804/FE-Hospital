import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const navigateToRegister = () => {
    navigate("/register");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);
      console.log(res)
      setResponse(res.data.message); 
      localStorage.setItem("token", res.data.token); // Store token for session
      localStorage.setItem("uid", JSON.stringify(res.data.uid));
      console.log(localStorage.getItem("token"))
      console.log("user", JSON.stringify(res.data.uid))
      const userRole = localStorage.getItem("token"); // Assuming role is returned in the response
      
      if (userRole === "DOCTOR") {
        navigate("/doctor");
      } else if (userRole === "PATIENT") {
        navigate("/appointments");
      }

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setResponse("");
    }
  };

  return (
    <div id="super-container">
      <div className="parent-container">
        <div id="login-container">
          <img src="src/assets/imgs/Doctor_20.png" alt="App Logo" />
          {error && <p id="Incorrect-credentials">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <i className="icon">&#128100;</i>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-container">
              <i className="icon">&#128274;</i>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <span className="spantext">New User?</span>
          <button id="lastbtn" onClick={navigateToRegister}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
