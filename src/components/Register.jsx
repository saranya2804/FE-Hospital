import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "PATIENT", // Default role
    email: "",
    specialization: "",
    contact: "",
  });

  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", formData);
      setResponse(res.data.message);
      setError("");
      navigate("/login"); // Navigate to login after successful registration
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setResponse("");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="DOCTOR">Doctor</option>
          <option value="PATIENT">Patient</option>
        </select>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {formData.role === "DOCTOR" && (
          <input
            type="text"
            name="specialization"
            placeholder="Enter Specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="text"
          name="contact"
          placeholder="Enter Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>

      {response && <p className="success">{response}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Register;
