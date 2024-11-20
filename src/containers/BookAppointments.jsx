import { useState } from "react";
import Axios from "axios";
import Navbar from "../components/navbar";
import logo from "../assets/imgs/Doctor_20.png";
import "../assets/css/bookappointment.css";
import { useNavigate } from "react-router-dom";

const BookAppointments = () => {
	const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    accepted: false, // Default accepted status
    date: "",
    completed: false, // Default completed status
    fee: 0, // Add fee
    doctorId: "", // Add doctorId
    slot: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // To display success or error messages

  const onMakeAppointment = async (e) => {
    e.preventDefault();

    if (!appointment.date || !appointment.slot || !appointment.doctorId) {
      window.alert("Please fill in all fields.");
      return;
    }

    // Get user information from localStorage
    const userId = localStorage.getItem("uid");
    console.log(userId);

    if (!userId) {
      setMessage("User is not authenticated. Please log in.");
      return;
    }

    setLoading(true);
    try {
      // Fetch patientId from the backend using userId
      const patientResponse = await Axios.get(`http://localhost:8080/patients/byUserId/${userId}`);
      const patientId = patientResponse.data.id; // Assuming the patient object contains an 'id' field

      const slotTimes = {
        "1": "7AM - 10AM",
        "2": "12PM - 4PM",
        "3": "6PM - 11PM",
      };

      // Send the request with all necessary fields
      const response = await Axios.post("http://localhost:8080/api/appointments", {
        appointmentDate: appointment.date, // Send the date
        patientId: patientId, // Pass the patientId fetched from the backend
        doctorId: appointment.doctorId, // Add doctorId
        fee: appointment.fee, // Add fee
        status: "Pending", // Default status as Pending
        accepted: appointment.accepted, // Add accepted status
        completed: appointment.completed, // Add completed status
        slot: slotTimes[appointment.slot], // Map slot to time range
      });

      if (response.status === 201) {
        setMessage("Appointment successfully scheduled!");
        setAppointment({
          date: "",
          slot: "",
          doctorId: "", // Reset doctorId
          fee: 0, // Reset fee
          accepted: false, // Reset accepted
          completed: false, // Reset completed
        });
		navigate('/appointmentpage')
      }
    } catch (error) {
      console.error("Error making appointment:", error);
      // Improved error handling with response data
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="super-container">
      <Navbar />
      <div className="parent-container">
        <form id="appointment-container" onSubmit={onMakeAppointment}>
          <img src={logo} alt="Health Insurance" className="logo" />
          <div className="input-container">
            <i className="fa fa-calendar-check icon"></i>
            <input
              id="dateinput"
              type="date"
              name="date"
              value={appointment.date}
              required
              onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
              className="input-field"
            />
          </div>
          <div className="input-container">
            <i className="fa fa-user-md icon"></i>
            <input
              id="doctorinput"
              type="number"
              name="doctorId"
              value={appointment.doctorId}
              required
              onChange={(e) => setAppointment({ ...appointment, doctorId: e.target.value })}
              className="input-field"
              placeholder="Doctor ID"
            />
          </div>
          <div className="input-container">
            <i className="fa fa-money icon"></i>
            <input
              id="feeinput"
              type="number"
              name="fee"
              value={appointment.fee}
              required
              onChange={(e) => setAppointment({ ...appointment, fee: e.target.value })}
              className="input-field"
              placeholder="Fee"
            />
          </div>
          <div className="radio-container">
            <h3 className="radio-container-head">Choose Time Slot</h3>
            <div className="radio-options">
              {[1, 2, 3].map((slot) => (
                <label key={slot}>
                  <input
                    className="radio"
                    type="radio"
                    name="slot"
                    value={slot}
                    checked={appointment.slot === String(slot)}
                    onChange={(e) => setAppointment({ ...appointment, slot: e.target.value })}
                  />
                  <span className="radio-text">{slot}</span>
                </label>
              ))}
            </div>
            <div className="slots-desc">
              <span>(1) 7AM - 10AM</span>
              <span>(2) 12PM - 4PM</span>
              <span>(3) 6PM - 11PM</span>
            </div>
          </div>
          <button
            id="submit"
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
        {message && <div className="message">{message}</div>} {/* Display message */}
      </div>
    </div>
  );
};

export default BookAppointments;
