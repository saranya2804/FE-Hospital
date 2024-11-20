import { useState } from "react";
import axios from "axios";
import "./login.css"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import logo from '../assets/imgs/Doctor_20.png'
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
      setResponse(res.data.message); // Success message from ApiResponse
      localStorage.setItem("token", res.data.token); // Store token for session
      
      const userRole = localStorage.getItem("token"); // Assuming the role is in the `data` field of the response
      console.log(userRole)
      if (userRole == "DOCTOR") {
        console.log("hi")
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
    <div id="super-container">
      <div className="parent-container">
        <div id="login-container">
          <img
            src= "src\assets\imgs\Doctor_20.png" // Replace with your logo or image
            alt="App Logo"
          />
          {error && <p id="Incorrect-credentials">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <i className="icon">&#128100;</i> {/* Optional icon */}
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
              <i className="icon">&#128274;</i> {/* Optional icon */}
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
          <button id="lastbtn" onClick={navigateToRegister}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
