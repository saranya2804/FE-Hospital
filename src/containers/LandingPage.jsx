import React, { useEffect, useState } from "react";
import Axios from "axios";
import { jsPDF } from "jspdf";
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

  const [pdfModalOpen, setPdfModalOpen] = useState(false); // State to control the modal visibility
  const [prescriptionText, setPrescriptionText] = useState(""); // State to store prescription data

  const fetchAppointments = async () => {
    if (!userId) {
      setError("User not logged in. Please log in first.");
      setAppointments([]);
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // Fetch patient info by userId
      const { data: patientData } = await Axios.get(
        `http://localhost:8080/patients/byUserId/${userId}`
      );
      console.log("Fetched patient data:", patientData);

      const patientId = patientData?.id;

      if (!patientId) {
        setError("No patient found for the given user ID.");
        setAppointments([]);
        return;
      }

      const response = await Axios.get(
        `http://localhost:8080/api/appointments/byPatientId/${patientId}`
      );
      console.log("Fetched appointments data:", response.data);

      // Check if the response contains appointments data (array)
      if (Array.isArray(response.data) && response.data.length > 0) {
        const updatedAppointments = await Promise.all(
          response.data.map(async (appointment) => {
            const { doctorId, appointmentDate, prescription, status } = appointment;

            try {
              const { data: doctorData } = await Axios.get(
                `http://localhost:8080/api/doctors/${doctorId}/appointments`
              );
              appointment.doctorName = doctorData?.name || "Unknown";
            } catch (error) {
              console.error(`Error fetching doctor data for doctorId ${doctorId}:`, error);
              appointment.doctorName = "Unknown";
            }

            // Format the appointment date
            appointment.date = appointmentDate
              ? new Date(appointmentDate).toLocaleDateString()
              : "Date not available";

            // Handle prescription value
            appointment.prescription =
              prescription === null || prescription.trim() === ""
                ? "No prescription available"
                : prescription.replace(/\n/g, "<br/>"); // Replace new lines with <br> for HTML rendering

            // Assign status
            appointment.status = status || "Pending";

            return appointment;
          })
        );

        setAppointments(updatedAppointments);
      } else {
        setError("No appointments found.");
        setAppointments([]);
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

  // Handle opening the PDF modal
  const handleViewPrescription = (prescriptionText) => {
    setPrescriptionText(prescriptionText);
    setPdfModalOpen(true); // Open the modal
  };

  // Handle downloading the prescription as PDF
  const handleDownloadPrescription = (prescriptionText) => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Set the font size and style
    doc.setFontSize(16);
    doc.setFont("helvetica");

    // Add text (prescription) to the document
    doc.text("Prescription", 10, 10); // Title
    doc.setFontSize(12); // Adjust text size for content
    doc.text(prescriptionText, 10, 20); // Actual prescription content

    // Save the generated PDF with a filename
    doc.save("prescription.pdf");
  };

  // Close the PDF modal
  const handleCloseModal = () => {
    setPdfModalOpen(false);
  };

  return (
    <div id="apt-container">
      <div className="navbar">
        <h1>My Appointments</h1>
      </div>
      <h1>Welcome, {userId ? "User" : "Guest"}!</h1>
      <p>Get all your  appointments here.</p>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p>No appointments found. Book an appointment to get started.</p>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div>
          {appointments.map((appointment) => {
            const { date, slot, healthIssue, doctorId, status, prescription, id } = appointment || {};
            return (
              <div key={id || Math.random()} className="appointment-card">
                <p>Date: {date || "Date not available"}</p>
                <p>Slot: {slot || "Unknown"}</p>
                <p>Health Issue: {healthIssue || "Unknown"}</p>
                <p>Doctor: {doctorId || "Unknown"}</p>
                <p data-status={status || "Pending"}>Status: {status || "Pending"}</p>

                {/* Only render prescription if it exists */}
                {prescription && prescription !== "null" && prescription !== null && (
                  <>
                    <p>
                      Prescription:{" "}
                      <button
                        onClick={() => handleViewPrescription(prescription)}
                      >
                        View Prescription
                      </button>
                    </p>
                    <button onClick={() => handleDownloadPrescription(prescription)}>
                      Download Prescription as PDF
                    </button>
                  </>
                )}

                {/* Option to update prescription */}
                {!prescription && (
                  <p>No prescription available for this appointment.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="actions">
        <button onClick={() => (window.location.href = "/appointments")}>
          Book More
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* PDF Modal */}
      {pdfModalOpen && (
        <div className="pdf-modal">
          <div className="pdf-modal-content">
            <h2>Prescription</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: prescriptionText,
              }}
            />
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
