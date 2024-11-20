import React, { useEffect, useState } from 'react';
import './doctordashboard.css';
import { FaTachometerAlt, FaCalendarAlt, FaUserInjured, FaFileAlt, FaCog, FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';

const DoctorDashboard = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [appointments, setAppointments] = useState([]); // State to store appointments
  const [activeSection, setActiveSection] = useState('Dashboard'); // Active section

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

  useEffect(() => {
    // Fetch patient count
    axios.get('http://localhost:8080/patients/getpatientcount')
      .then(response => setPatientCount(response.data))
      .catch(error => console.error('Error fetching patient count:', error));

    // Fetch appointment count
    axios.get('http://localhost:8080/api/appointments/appointmentcount')
      .then(response => setAppointmentCount(response.data))
      .catch(error => console.error('Error fetching appointment count:', error));
  }, []);

  const fetchAppointments = () => {
    axios.get('http://localhost:8080/api/appointments/all')
      .then(response => setAppointments(response.data))
      .catch(error => console.error('Error fetching appointments:', error));
  };

  const renderContent = () => {
    if (activeSection === 'Dashboard') {
      return (
        <div>
          <div className="TotalPatients">
            <h3>Total Patients</h3>
            <p>{patientCount}</p>
          </div>
          <div className="TotalAppointments">
            <h3>Total Appointments</h3>
            <p>{appointmentCount}</p>
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
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.fee}</td>
                  <td>{appointment.setStatus}</td>
                  <td>{appointment.patientId}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <p className="section-title">General</p>
        <div className="menu-item" onClick={() => setActiveSection('Dashboard')}>
          <FaTachometerAlt className="icon" />
          <h4>Dashboard</h4>
        </div>
        <div
          className="menu-item"
          onClick={() => {
            setActiveSection('Appointments');
            fetchAppointments();
          }}
        >
          <FaCalendarAlt className="icon" />
          <h4>Appointment</h4>
        </div>
        <div className="menu-item">
          <FaUserInjured className="icon" />
          <h4>Patient</h4>
        </div>
        <div className="menu-item">
          <FaFileAlt className="icon" />
          <h4>Reports</h4>
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
          <h2>Welcome Dr!</h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DoctorDashboard;
