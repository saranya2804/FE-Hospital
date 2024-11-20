import React, { useContext, useEffect } from "react";
import {LoginDetails} from "../context/UserContext";
import "../assets/css/homepage.css";
import { FaBed, FaAmbulance, FaMedkit, FaWheelchair, FaFlask, FaPhoneAlt } from "react-icons/fa"; // Import React Icons

const HomePage = () => {
	const { loggedIn } = useContext(LoginDetails);

	useEffect(() => {
		if (loggedIn) {
			window.location.href = "/appointmentpage";
		}
	}, [loggedIn]);

	const onAppointmentBook = () => {
		window.location.href = "/login";
	};

	return (
		<React.Fragment>
			{/* Header can be uncommented if needed */}
			{/* <Header /> */}

			<div className="services" id="services">
				<h1 id="services-head">Best in Town</h1>
				<div className="service-container">
					{/* Service Cards with React Icons */}
					<div className="service-card">
						<FaBed className="service-icon" />
						<h4>Emergencies</h4>
					</div>
					<div className="service-card">
						<FaAmbulance className="service-icon" />
						<h4>Ambulance</h4>
					</div>
					<div className="service-card">
						<FaMedkit className="service-icon" />
						<h4>Medical Kit</h4>
					</div>
				</div>
				<div className="service-container">
					<div className="service-card">
						<FaWheelchair className="service-icon" />
						<h4>Wheelchair</h4>
					</div>
					<div className="service-card">
						<FaFlask className="service-icon" />
						<h4>Laboratory</h4>
					</div>
					<div className="service-card">
						<FaPhoneAlt className="service-icon" />
						<h4>
							24x7
							<br />
							Helpline
						</h4>
					</div>
				</div>
			</div>

			{/* Appointment section */}
			<div className="appointment-section">
				<h4 className="appointment-heading">
					Hassle-free, book an appointment with our system online!
				</h4>
				<button className="book-appointment-btn" onClick={onAppointmentBook}>
					Login to Book
				</button>
			</div>

			{/* Footer can be uncommented if needed */}
			{/* <Footer /> */}
		</React.Fragment>
	);
};

export default HomePage;
