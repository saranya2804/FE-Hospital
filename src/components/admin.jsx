import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaUserMd, FaUsers, FaCog } from 'react-icons/fa';
import "./admin.css";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeSection, setActiveSection] = useState("Appointments");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = () => {
    axios
      .get("http://localhost:8080/api/admin/appointments")
      .then((response) => setAppointments(response.data))
      .catch((error) => console.error("Error fetching appointments:", error));
  };

  const fetchPatients = () => {
    axios
      .get("http://localhost:8080/api/admin/patients")
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  };

  const fetchDoctors = () => {
    axios
      .get("http://localhost:8080/api/admin/doctors")
      .then((response) => setDoctors(response.data))
      .catch((error) => console.error("Error fetching doctors:", error));
  };

  const handleEdit = (type, id) => {
    if (type === "Appointment") {
      const appointment = appointments.find(app => app.id === id);
      setEditData({ ...appointment });
    } else if (type === "Patient") {
      const patient = patients.find(pat => pat.id === id);
      setEditData({ ...patient });
    } else if (type === "Doctor") {
      const doctor = doctors.find(doc => doc.id === id);
      setEditData({ ...doctor });
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
  
    try {
      // Construct the URL dynamically based on type and ID
      const url = `http://localhost:8080/api/admin/${type.toLowerCase()}s/${id}`;
      console.log(`Attempting DELETE request to: ${url}`);
  
      // Perform the DELETE request
      await axios.delete(url);
  
      // Update the relevant state based on the type
      if (type === "Appointment") {
        fetchAppointments();
      } else if (type === "Patient") {
        fetchPatients();
      } else if (type === "Doctor") {
        fetchDoctors();
      }
  
      alert(`${type} deleted successfully!`);
    } catch (error) {
      if (error.response) {
        console.error(`Error response:`, error.response.data);
        alert(`Error: ${error.response.data.message || "Failed to delete data"}`);
      } else {
        console.error(`Error deleting ${type}:`, error.message);
        alert("Failed to delete data");
      }
    }
  };
  
  

  const transformEditData = (type, editData) => {
  if (!editData) return null;

  switch (type) {
    case "Appointment":
      return {
        id: editData.id,
        appointmentDate: editData.appointmentDate,
        fee: parseFloat(editData.fee),
        status: editData.status,
        slot: editData.slot,
        healthIssue: editData.healthIssue,
        prescription: editData.prescription || null,
        doctorname: editData.doctorname,
        patientname: editData.patientname,
        doctor: {
          id: editData.doctorId, // Backend expects doctor as an object with id
        },
        patient: {
          id: editData.patientId, // Backend expects patient as an object with id
        },
      };

    case "Doctor":
      return {
        id: editData.id,
        name: editData.name,
        specialization: editData.specialization,
        email: editData.email,
        contact: parseInt(editData.contact),
        user: {
          id: editData.userId || null, // If user ID exists
          username: editData.username || null,
          password: editData.password || null,
          email: editData.email,
          role: "DOCTOR",
          specialization: editData.specialization,
          contact: parseInt(editData.contact),
        },
      };

    case "Patient":
      return {
        id: editData.id,
        name: editData.name,
        email: editData.email,
        contact: parseInt(editData.contact),
        user: {
          id: editData.userId || null, // If user ID exists
          username: editData.username || null,
          password: editData.password || null,
          email: editData.email,
          role: "PATIENT",
          contact: parseInt(editData.contact),
        },
      };

    default:
      return editData;
  }
};

const handleSave = async (type, id) => {
  try {
    const transformedData = transformEditData(type, editData);
    console.log("Transformed Data for Save:", transformedData);

    let response;
    if (type === "Appointment") {
      response = await axios.put(`http://localhost:8080/api/admin/appointments/${id}`, transformedData);
      fetchAppointments();
    } else if (type === "Patient") {
      response = await axios.put(`http://localhost:8080/api/admin/patients/${id}`, transformedData);
      fetchPatients();
    } else if (type === "Doctor") {
      response = await axios.put(`http://localhost:8080/api/admin/doctors/${id}`, transformedData);
      fetchDoctors();
    }

    console.log("Save response:", response.data);
    alert("Data updated successfully!");
    setEditData(null);
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      alert(`Error: ${error.response.data.message || "Failed to save data"}`);
    } else {
      console.error("Error saving data:", error.message);
      alert("Failed to save data");
    }
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderAppointments = () => (
    <div>
      <h3>Appointments</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Fee</th>
            <th>Status</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>
                {editData && editData.id === appointment.id ? (
                  <input
                    type="date"
                    name="appointmentDate"
                    value={editData.appointmentDate || ""}
                    onChange={handleChange}
                  />
                ) : (
                  appointment.appointmentDate
                )}
              </td>
              <td>
                {editData && editData.id === appointment.id ? (
                  <input
                    type="number"
                    name="fee"
                    value={editData.fee || ""}
                    onChange={handleChange}
                  />
                ) : (
                  appointment.fee
                )}
              </td>
              <td>
                {editData && editData.id === appointment.id ? (
                  <input
                    type="text"
                    name="status"
                    value={editData.status || ""}
                    onChange={handleChange}
                  />
                ) : (
                  appointment.status
                )}
              </td>
              <td>
                {editData && editData.id === appointment.id ? (
                  <input
                    type="number"
                    name="patientId"
                    value={editData.patientId || ""}
                    onChange={handleChange}
                  />
                ) : (
                  appointment.patientId
                )}
              </td>
              <td>
                {editData && editData.id === appointment.id ? (
                  <input
                    type="number"
                    name="doctorId"
                    value={editData.doctorId || ""}
                    onChange={handleChange}
                  />
                ) : (
                  appointment.doctorId
                )}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPatients = () => (
    <div>
      <h3>Patients</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td>
                {editData && editData.id === patient.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ""}
                    onChange={handleChange}
                  />
                ) : (
                  patient.name
                )}
              </td>
              <td>
                {editData && editData.id === patient.id ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ""}
                    onChange={handleChange}
                  />
                ) : (
                  patient.email
                )}
              </td>
              <td>
                {editData && editData.id === patient.id ? (
                  <input
                    type="text"
                    name="contact"
                    value={editData.contact || ""}
                    onChange={handleChange}
                  />
                ) : (
                  patient.contact
                )}
              </td>
              <td>
                {editData && editData.id === patient.id ? (
                  <button className="save-button" onClick={() => handleSave("Patient", patient.id)}>Save</button>
                ) : (
                  <button className="edit-button" onClick={() => handleEdit("Patient", patient.id)}>Edit</button>
                )}
                <button className="delete-button" onClick={() => handleDelete("Patient", patient.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDoctors = () => (
    <div>
      <h3>Doctors</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.id}>
              <td>{doctor.id}</td>
              <td>
                {editData && editData.id === doctor.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ""}
                    onChange={handleChange}
                  />
                ) : (
                  doctor.name
                )}
              </td>
              <td>
                {editData && editData.id === doctor.id ? (
                  <input
                    type="text"
                    name="specialization"
                    value={editData.specialization || ""}
                    onChange={handleChange}
                  />
                ) : (
                  doctor.specialization
                )}
              </td>
              <td>
                {editData && editData.id === doctor.id ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ""}
                    onChange={handleChange}
                  />
                ) : (
                  doctor.email
                )}
              </td>
              <td>
                {editData && editData.id === doctor.id ? (
                  <input
                    type="text"
                    name="contact"
                    value={editData.contact || ""}
                    onChange={handleChange}
                  />
                ) : (
                  doctor.contact
                )}
              </td>
              <td>
                {editData && editData.id === doctor.id ? (
                  <button className="save-button" onClick={() => handleSave("Doctor", doctor.id)}>Save</button>
                ) : (
                  <button className="edit-button" onClick={() => handleEdit("Doctor", doctor.id)}>Edit</button>
                )}
                <button className="delete-button" onClick={() => handleDelete("Doctor", doctor.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-sidebar">
      <p className="admin-section-title">Admin Dashboard</p>
        <ul>
          <li className="admin-menu-item" onClick={() => setActiveSection("Appointments")}><FaCalendarAlt className="admin-icon" /> Appointments</li>
          <li className="admin-menu-item" onClick={() => setActiveSection("Patients")}><FaUsers className="admin-icon"/> Patients</li>
          <li className="admin-menu-item" onClick={() => setActiveSection("Doctors")}><FaUserMd className="admin-icon"/> Doctors</li>
          <li className="admin-menu-item"><FaCog className="admin-icon"/> Settings</li>
        </ul>
      </div>
      <div className="content">
        {activeSection === "Appointments" && renderAppointments()}
        {activeSection === "Patients" && renderPatients()}
        {activeSection === "Doctors" && renderDoctors()}
      </div>
    </div>
  );
};

export default AdminDashboard;
