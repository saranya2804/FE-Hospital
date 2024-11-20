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
    <div className="login-container">
      <fieldset>
        <legend>Login</legend>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          

          <div>
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

        <span
          className="register-link"
          onClick={navigateToRegister}
          style={{
            color: "darkblue",
            cursor: "pointer",
            textDecoration: "underline",
            padding: "2px",
          }}
        >
          New User?
        </span>
      </fieldset>

      {response && <p className="success">{response}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
