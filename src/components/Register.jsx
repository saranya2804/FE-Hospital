/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const ref1 = useRef(null); // Username
  const ref2 = useRef(null); // Password
  const ref3 = useRef(null); // Confirm Password
  const ref4 = useRef(null); // Role (dropdown)
  const ref5 = useRef(null); // Email

  const handleRegister = async () => {
    const email = ref5.current.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (ref2.current.value !== ref3.current.value) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", {
        username: ref1.current.value,
        password: ref2.current.value,
        role: ref4.current.value,
        email: ref5.current.value,
      });

      const { message } = res.data;
      alert(message);
      navigate("/"); // Redirect to login after successful registration
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <fieldset>
        <legend>Registration</legend>

        <input type="text" id="username" placeholder="Enter Username" ref={ref1} />
        <br />

        <input type="email" id="email" placeholder="Enter Email" ref={ref5} />
        <br />

        <input type="password" id="password" placeholder="Enter Password" ref={ref2} />
        <br />

        <input type="password" id="confirm-password" placeholder="Confirm Password" ref={ref3} />
        <br />

        <select id="role" ref={ref4} defaultValue="PATIENT">
          <option value="ADMIN">Admin</option>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
        </select>
        <br />

        <button onClick={handleRegister}>Register</button>
        <br/>
        <span
          className="login-link"
          onClick={() => navigate("/")}
          style={{ color: "darkblue", cursor: "pointer", textDecoration: "underline" ,padding:"2px"}}
        >
          Already a user?
        </span>
     
      </fieldset>

      
    </div>
  );
};

export default Register;
