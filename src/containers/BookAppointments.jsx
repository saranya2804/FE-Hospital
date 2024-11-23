import { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../components/navbar";
import logo from "../assets/imgs/Doctor_20.png";
import "../assets/css/bookappointment.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PatientSidebar from "../components/PatientSidebar";

const BookAppointments = () => {
  const [activeSection, setActiveSection] = useState("BookAppointments");
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    date: "",
    doctorId: "",
    fee: 1000,
    slot: "",
    healthIssue: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]); // Available dates
  const [availableSlots, setAvailableSlots] = useState([]); // Slots for selected date

  // Fetch doctors from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await Axios.get("http://localhost:8080/api/doctors/all");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available slots and dates for the selected doctor
  useEffect(() => {
    const fetchAvailableSlotsAndDates = async () => {
      if (appointment.doctorId) {
        try {
          const response = await Axios.get(
            `http://localhost:8080/api/doctors/getAvailableSlotsAndDate/${appointment.doctorId}`
          );
          console.log("Available Slots and Dates:", response.data);

          // Extract unique dates and set available dates
          const dates = [...new Set(response.data.map((slot) => slot.date))];
          setAvailableDates(dates);

          // Clear slots when doctor changes
          setAvailableSlots([]);
          setAppointment({ ...appointment, date: "", slot: "" });
        } catch (error) {
          console.error("Error fetching available slots and dates:", error);
        }
      }
    };
    fetchAvailableSlotsAndDates();
  }, [appointment.doctorId]);

  // Update available slots when a date is selected
  useEffect(() => {
    const filterSlotsForSelectedDate = async () => {
      if (appointment.date) {
        try {
          // Assuming availableSlotsAndDates is already fetched
          const response = await Axios.get(
            `http://localhost:8080/api/doctors/getAvailableSlotsAndDate/${appointment.doctorId}`
          );

          // Filter slots for the selected date
          const slots = response.data.filter(
            (slot) => slot.date === appointment.date
          );
          setAvailableSlots(slots);
        } catch (error) {
          console.error("Error filtering slots:", error);
        }
      }
    };
    filterSlotsForSelectedDate();
  }, [appointment.date]);

  // Handle appointment submission
  const onMakeAppointment = async (e) => {
    e.preventDefault();

    if (!appointment.date || !appointment.slot || !appointment.doctorId || !appointment.healthIssue) {
      window.alert("Please fill in all fields.");
      return;
    }

    const userId = localStorage.getItem("uid");
    if (!userId) {
      setMessage("User is not authenticated. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const { data: patientData } = await Axios.get(
        `http://localhost:8080/patients/byUserId/${userId}`
      );

      const patientId = patientData?.id;
      const response = await Axios.post("http://localhost:8080/api/appointments", {
        appointmentDate: appointment.date,
        patientId: patientId,
        doctorId: appointment.doctorId,
        fee: appointment.fee,
        status: "Pending",
        accepted: false,
        completed: false,
        slot: appointment.slot,
        healthIssue: appointment.healthIssue,
      });

      if (response.status === 200) {
        setMessage("Appointment successfully scheduled!");
        setAppointment({
          date: "",
          slot: "",
          doctorId: "",
          fee: 1000,
          healthIssue: "",
        });
        navigate("/appointmentpage");
      } else {
        setMessage("Appointment scheduling failed.");
      }
    } catch (error) {
      console.error("Error making appointment:", error);
      const errorMessage = error.response?.data?.message || " This Slot is not Available";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <PatientSidebar setActiveSection={setActiveSection} />
      <div className="DashboardContent">
        <div id="super-container">
          <div className="parent-container">
            <form id="appointment-container" onSubmit={onMakeAppointment}>
              <img src={logo} alt="Health Insurance" className="logo" />
              <div className="input-container">
                <i className="fa fa-user-md icon"></i>
                <select
                  id="doctorDropdown"
                  value={appointment.doctorId}
                  required
                  onChange={(e) =>
                    setAppointment({ ...appointment, doctorId: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">-- Select a Doctor --</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              {availableDates.length > 0 && (
                <div className="input-container">
                  <i className="fa fa-calendar-check icon"></i>
                  <select
                    id="dateDropdown"
                    value={appointment.date}
                    required
                    onChange={(e) =>
                      setAppointment({ ...appointment, date: e.target.value })
                    }
                    className="input-field"
                  >
                    <option value="">-- Select a Date --</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {date}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {availableSlots.length > 0 && (
                <div className="radio-container">
                  <h3 className="radio-container-head">Choose Time Slot</h3>
                  <div className="radio-options">
                    {availableSlots.map((slot) => (
                      <label key={slot.id}>
                        <input
                          className="radio"
                          type="radio"
                          name="slot"
                          value={slot.timeSlot}
                          checked={appointment.slot === slot.timeSlot}
                          onChange={(e) =>
                            setAppointment({ ...appointment, slot: e.target.value })
                          }
                        />
                        <span className="radio-text">{slot.timeSlot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="input-container">
                <i className="fa fa-stethoscope icon"></i>
                <textarea
                  id="healthIssue"
                  name="healthIssue"
                  value={appointment.healthIssue}
                  required
                  onChange={(e) =>
                    setAppointment({ ...appointment, healthIssue: e.target.value })
                  }
                  className="input-field"
                  placeholder="Describe your health issue"
                />
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
            {message && <div className="message">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointments;
