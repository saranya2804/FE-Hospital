import React, { useEffect, useState } from 'react';
import './doctordashboard.css';
import { FaTachometerAlt, FaCalendarAlt, FaUserInjured, FaFileAlt, FaCog, FaQuestionCircle, FaPlus } from 'react-icons/fa';
import axios from 'axios';


const DoctorDashboard = () => {
  const doctorId = localStorage.getItem('doctorId');
  const userId = localStorage.getItem("uid");
  console.log(userId)
  const [PendingCount, setPendingCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [earnings, setTotalEarnings] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPatients, setSearchedPatients] = useState([]);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State for selected appointment
  const [prescription, setPrescription] = useState(""); // State for prescription input
  const [acceptedcount, setAcceptedCount] = useState("");
  const [doctorName, setDoctorName] = useState("")
  const [slotFormVisible, setSlotFormVisible] = useState(false); // New state for Add Slot form
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const faqs = [
    { question: "How do I schedule an appointment?", answer: "Navigate to the Appointments section and click on 'Schedule Appointment'." },
    { question: "How do I view patient details?", answer: "Go to the Patients section and select a patient from the list to view their details." },
    { question: "How do I generate a report?", answer: "Use the Reports section to generate detailed reports for patients or appointments." },
    { question: "How can I update my profile information?", answer: "Go to the Settings section and edit your profile information." },
    { question: "What should I do if I forget my password?", answer: "Click on 'Forgot Password' on the login page to reset your password." },
    { question: "How do I contact support?", answer: "Reach out to support at support@hospital.com or call 123-456-7890." },
    { question: "Can I cancel an appointment?", answer: "Yes, you can cancel appointments from the Appointments section by selecting the appointment and clicking 'Cancel'." },
    { question: "How do I update appointment statuses?", answer: "Appointment statuses can be updated in the Appointments section by selecting the appointment and editing its status." }
  ];
  

  // Fetch data (patients, appointments) on initial load
  useEffect(() => {
    axios.get(`http://localhost:8080/api/doctors/getDoctorName/${doctorId}`)
    .then(response=>setDoctorName(response.data))
    .catch(error=>console.error('error fetching Doctor Name : ',error))

    axios.get(`http://localhost:8080/api/appointments/getAcceptedAppointmentsCount/${doctorId}`)
    .then(response=>setAcceptedCount(response.data))
    .catch(error=>console.error('error fetching accepted count : ',error))

    axios.get(`http://localhost:8080/api/appointments/getPatientCount/${doctorId}`)
    .then(response=>setPatientCount(response.data))
    .catch(error=>console.error('error fetching patient count : ',error))

    axios.get(`http://localhost:8080/api/appointments/getPendingAppointmentsCount/${doctorId}`)
      .then(response => setPendingCount(response.data))
      .catch(error => console.error('Error fetching pending count:', error));

    axios.get(`http://localhost:8080/api/appointments/appointmentcount/${doctorId}`)
      .then(response => setAppointmentCount(response.data))
      .catch(error => console.error('Error fetching appointment count:', error));

    axios.get('http://localhost:8080/patients/get-all-patients')
      .then(response => {
        setPatients(response.data);
        setSearchedPatients(response.data);
      })
      .catch(error => console.error('Error fetching patients:', error));

      axios.get(`http://localhost:8080/api/doctors/${doctorId}/earnings`)  // Update with actual doctorId
      .then(response => setTotalEarnings(response.data))
      .catch(error => console.error('Error fetching total earnings:', error));
      console.log(earnings)
  }, []);
  console.log(doctorName)

  // Fetch appointments for the selected section
  const fetchAppointments = () => {
    axios.get('http://localhost:8080/api/appointments/all')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  };

  // Handle patient search
  const searchPatients = () => {
    const filteredPatients = patients.filter(patient => 
      patient.id.toString().includes(searchQuery) || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchedPatients(filteredPatients);
  };

  // Handle selecting an appointment
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setPrescription(appointment.prescription || ""); // Pre-fill prescription if available
  };

  // Handle prescription form submission
  const handlePrescriptionSubmit = () => {
    if (selectedAppointment && prescription) {
      axios.put(`http://localhost:8080/api/appointments/${selectedAppointment.id}/prescription`, prescription, {
        headers: {
          'Content-Type': 'text/plain', // Or 'application/json' if you're sending JSON
        }
      })
        .then(response => {
          // Update the selected appointment with the response data
          setSelectedAppointment(response.data);
  
          // Update the status of the appointment in the appointments list
          setAppointments(prevAppointments => 
            prevAppointments.map(appointment => 
              appointment.id === selectedAppointment.id
                ? { ...appointment, status: "Prescription Added" }
                : appointment
            )
          );
  
          alert('Prescription updated successfully!');
        })
        .catch(error => console.error('Error updating prescription:', error));
    }
  };

  const handleAcceptAppointment = (appointmentId) => {
    axios.put(`http://localhost:8080/api/appointments/${appointmentId}/status/accept`)
      .then(response => {
        alert('Appointment accepted successfully!');
        fetchAppointments(); // Refresh appointments
      })
      .catch(error => console.error('Error accepting appointment:', error));
  };

  // Handle appointment decline
  const handleDeclineAppointment = (appointmentId) => {
    axios.put(`http://localhost:8080/api/appointments/${appointmentId}/status/decline`)
      .then(response => {
        alert('Appointment declined successfully!');
        fetchAppointments(); // Refresh appointments
      })
      .catch(error => console.error('Error declining appointment:', error));
  };
  const handleAddSlotSubmit = () => {
    const slotData = {
      date: slotDate,
      timeSlot: `${slotTime.start} - ${slotTime.end}`,
    };
    axios
    .post(`http://localhost:8080/api/doctors/addAppointmentsDateAndSlots/${doctorId}`, slotData)
    .then((response) => {
      alert("Slot added successfully!");
      setSlotFormVisible(false); // Hide the form after submission
      setSlotDate("");
      setSlotTime({ start: "", end: "" });
    })
    .catch((error) => console.error("Error adding slot:", error));
};


  // Render different sections based on active section
  const renderContent = () => {
    if (activeSection === 'Dashboard') {
      return (
        <div className='cont'>
          <div className="TotalPatients">
            <h3>Total Patients</h3>
            <p>{patientCount}</p>
          </div>
          <div className="TotalPatients">
            <h3>Pending Appointments</h3>
            <p>{PendingCount}</p>
          </div>
          <div className="TotalPatients">
            <h3>Accepted Appointments</h3>
            <p>{acceptedcount}</p>
          </div>
          <div className="TotalAppointments">
            <h3>Total Appointments</h3>
            <p>{appointmentCount}</p>
          </div>
          <div className="TotalEarnings">
          <h3>Total Earnings</h3>
          <p>${earnings}</p> {/* Assuming earnings is a numeric value */}
        </div>
        </div>
      );
    } else if (activeSection === 'Appointments') {
      return (
        <div>
          <h3>Appointments</h3>
          <table className="appointments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Patient ID</th>
                <th>Issue</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.fee}</td>
                  <td>{appointment.status}</td>
                  <td>{appointment.patientId}</td>
                  <td>{appointment.healthIssue}</td>
                  <td>
  <button 
    className="write-prescription" 
    onClick={() => handleAppointmentClick(appointment)}>
    Write Prescription
  </button>
  <button 
    className="decline" 
    onClick={() => handleDeclineAppointment(appointment.id)}>
    Decline
  </button>
  <button 
    className="accept" 
    onClick={() => handleAcceptAppointment(appointment.id)}>
    Accept
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (activeSection === 'Patients') {
      return (
        <div className="search-container">
          <h3 className="search-title">Search Patient</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Enter Patient ID or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={searchPatients}>
            Search
          </button>
      
          {searchedPatients.length > 0 ? (
            <div className="patients-container">
              <h4 className="patients-title">Patient Details</h4>
              <table className="patients-table">
                <thead>
                  <tr>
                    <th className="table-header">ID</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">CONTACT</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedPatients.map((patient) => (
                    <tr key={patient.id} className="table-row">
                      <td className="table-cell">{patient.id}</td>
                      <td className="table-cell">{patient.name}</td>
                      <td className="table-cell">{patient.email}</td>
                      <td className="table-cell">{patient.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-patients-message">
              No patients found matching your search criteria.
            </p>
          )}
        </div>
      );
    } else if (activeSection === 'HelpAndSupport') {
      return (
        <div className="faq-container">
          <h3>Frequently Asked Questions (FAQs)</h3>
          <div className="faq-content">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h4 className="faq-question">{faq.question}</h4>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }else if (activeSection === 'AddSlot') {
      return (
        <div className="slot-form">
  <h3>Add Slot</h3>
  <label>
    Date:
    <input
      type="date"
      value={slotDate}
      onChange={(e) => setSlotDate(e.target.value)}
    />
  </label>
  <label>
    Start Time:
    <input
      type="time"
      value={slotTime.start}
      onChange={(e) => setSlotTime((prev) => ({ ...prev, start: e.target.value }))}
    />
  </label>
  <label>
    End Time:
    <input
      type="time"
      value={slotTime.end}
      onChange={(e) => setSlotTime((prev) => ({ ...prev, end: e.target.value }))}
    />
  </label>
  <button onClick={handleAddSlotSubmit}>Submit</button>
  <button onClick={() => setSlotFormVisible(false)}>Cancel</button>
</div>
      );
    }
    } 
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <p className="section-title">General</p>
        <div className="menu-item" onClick={() => setActiveSection('Dashboard')}>
          <FaTachometerAlt className="icon" />
          <h4>Dashboard</h4>
        </div>
        <div className="menu-item" onClick={() => { setActiveSection('Appointments'); fetchAppointments(); }}>
          <FaCalendarAlt className="icon" />
          <h4>Appointment</h4>
        </div>
        <div className="menu-item" onClick={() => setActiveSection('Patients')}>
          <FaUserInjured className="icon" />
          <h4>Patients</h4>
        </div>
        <div className="menu-item" onClick={()=>setActiveSection('AddSlot')}>
          <FaFileAlt className="icon" />
          <h4>Add Slot</h4>
        </div>
        <p className="section-title">Settings</p>
        <div className="menu-item" onClick={() => setActiveSection('HelpAndSupport')}>
          <FaQuestionCircle className="icon" />
          <h4>Help & Supports</h4>
        </div>
        <div className="menu-item">
          <FaCog className="icon" />
          <h4>Settings</h4>
        </div>
      </div>

      <div className="DashboardContent">
        <div className="title">
        <h2>Welcome Dr. {doctorName}!</h2>
        </div>
        {renderContent()}
        
        {/* Prescription Modal or Section */}
        {selectedAppointment && (
          <div className="prescription-section">
            <h3>Write Prescription for Appointment ID: {selectedAppointment.id}</h3>
            <textarea
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter prescription details..."
            />
            <button onClick={handlePrescriptionSubmit}>Submit Prescription</button>

          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
