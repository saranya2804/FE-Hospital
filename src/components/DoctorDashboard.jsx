/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './doctordashboard.css'
import { FaTachometerAlt, FaCalendarAlt, FaUserInjured, FaFileAlt, FaCog, FaQuestionCircle } from 'react-icons/fa';
import axios from 'axios';
const DoctorDashboard = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

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
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <p className="section-title">General</p>
        <div className="menu-item">
          <FaTachometerAlt className="icon" />
          <h4>Dashboard</h4>
        </div>
        <div className="menu-item">
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
        <div className="menu-item">
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
      <div className="TotalPatients">
        <h3>Total Patients</h3>
        <p>{patientCount}</p>
      </div>
      <div className="TotalAppointments">
        <h3>Total Appointments</h3>
        <p>{appointmentCount}</p>
      </div>
      <div>
        
      </div>
    </div>
    </div>
  );
};

export default DoctorDashboard;
