import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUserInjured,
  FaFileAlt,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";

const Sidebar = ({ setActiveSection }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        setActiveSection("Appointments");  // Update active section state
        navigate("/appointmentpage");      // Redirect to the appointment page
      };
  
  return (
    <div className="sidebar">
      <p className="section-title">General</p>
      <div className="menu-item" onClick={() => setActiveSection('Dashboard')}>
        <FaTachometerAlt className="icon" />
        <h4>Dashboard</h4>
      </div>
      <div className="menu-item" onClick={handleNavigation}>
      <FaCalendarAlt className="icon" />
      <h4>Appointment</h4>
    </div>
      <div className="menu-item" onClick={() => setActiveSection('Patients')}>
        <FaUserInjured className="icon" />
        <h4>Patients</h4>
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
  );
};

export default Sidebar;
