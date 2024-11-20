import { useState } from "react";
import axios from "axios";
import "./login.css"; 
import { useNavigate } from "react-router-dom";

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
      setError("");
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setResponse("");
    }
  };

  return (
    <>
    
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <a onClick={navigateToRegister} style={{ cursor: "pointer" }}>New User?</a>
      </form>
      {response && <p className="success">{response}</p>}
      {error && <p className="error">{error}</p>}
    </div>
    </>
  );
};

export default Login;
