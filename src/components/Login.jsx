import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState(0);
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
      localStorage.setItem("role",res.data.role);
      console.log(localStorage.getItem("role"))
      console.log("user", JSON.stringify(res.data.uid))
      const userRole = localStorage.getItem("role"); // Assuming role is returned in the response
      console.log(userRole)
      if (userRole === "DOCTOR") {
        navigate("/doctor");
      } else if (userRole === "PATIENT") {
        navigate("/appointments");
      }
      else if(userRole === "ADMIN"){
        navigate("/admin");
      }

      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setResponse("");
    }
  };
  const userId = localStorage.getItem('uid')
  axios.get(`http://localhost:8080/api/doctors/${userId}`)
    .then(response=>setDoctorId(response.data))
    .catch(error=>console.error('error fetching doctorId:',error))
  localStorage.setItem('doctorId',doctorId)
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
