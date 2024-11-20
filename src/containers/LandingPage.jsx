import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../assets/css/main.css";

const LandingPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("uid")) || null;
    } catch (err) {
      console.error("Error parsing localStorage:", err);
      return null;
    }
  });

  const fetchAppointments = async () => {
    if (!userId) {
      setError("User not logged in. Please log in first.");
      setAppointments([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fetch patient info by userId
      const { data: patientData } = await Axios.get(
        `http://localhost:8080/patients/byUserId/${userId}`
      );

      const patientId = patientData?.id;
      if (!patientId) {
        setError("No patient found for the given user ID.");
        setAppointments([]);
        return;
      }

      // Fetch appointments by patientId
      const { data: appointmentsData } = await Axios.get(
        `http://localhost:8080/api/appointments/byPatientId/${patientId}`
      );

      // Fetch doctor details for each appointment
      const updatedAppointments = await Promise.all(
        appointmentsData.map(async (appointment) => {
          const { doctorId, appointmentDate } = appointment;

          // Fetch doctor information by doctorId (we will just display doctorId here)
          appointment.doctorName = doctorId || "Unknown";

          // Format the appointment date
          appointment.date = appointmentDate
            ? new Date(appointmentDate).toLocaleDateString()
            : "Date not available";

          return appointment;
        })
      );

      setAppointments(updatedAppointments || []);
      if (!appointmentsData.length) {
        setError("No appointments found.");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err.response?.data?.message ||
        "Unable to fetch appointments. Please try again later."
      );
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Inline AppointmentCard Component
  const AppointmentCard = ({ appointment }) => {
    const { id, date, doctorName, status } = appointment || {};

    return (
      <div className="appointment-card">
        <h3>Appointment ID: {id || "N/A"}</h3>
        <p>Date: {date || "Date not available"}</p>
        <p>Doctor ID: {doctorName || "Unknown"}</p> {/* Displaying doctorId instead of name */}
        <p>Status: {status || "Pending"}</p>
      </div>
    );
  };

  return (
    <div id="apt-container">
      <div className="navbar">
        <h1>My Appointments</h1>
      </div>
      <h1>Welcome, {userId ? "User" : "Guest"}!</h1>
      <p>Get all your pending appointments here.</p>

      <div className="actions">
        <button onClick={() => (window.location.href = "/appointments")}>
          Book More
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p>No appointments found. Book an appointment to get started.</p>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div>
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
