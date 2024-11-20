import { useState } from "react";
import axios from "axios";
import "./login.css"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import logo from '../assets/imgs/Doctor_20.png';

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
      setResponse(res.data.message);
      localStorage.setItem("token", res.data.token);

      const userRole = localStorage.getItem("token");
      if (userRole === "DOCTOR") {
        navigate("/doctor");
      } else if (userRole === "PATIENT") {
        navigate("/appointmentpage");
      }
      
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setResponse("");
    }
  };

  return (
    <div className="login-container">
      <legend>Login</legend>
      <img src={logo} alt="App Logo" />
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>New User?</p>
      <button onClick={navigateToRegister}>Register</button>
    </div>
  );
};

export default Login;
