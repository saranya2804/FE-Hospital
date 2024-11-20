import Axios from "axios";
import React, { useState, useContext } from "react";
import LoginDetails from "../context/LoginContext";
import Navbar from "../components/navbar";
import logo from "../assets/imgs/Doctor_20.png";
import "../assets/css/bookappointment.css";  // External CSS

const BookAppointments = () => {
	const { user, baseURL } = useContext(LoginDetails);
	const [appointment, setAppointment] = useState({});

	const onMakeAppointment = async (e) => {
		e.preventDefault();
	
		if (!appointment.date || !appointment.slot) {
			window.alert("Please fill in all fields.");
			return;
		}
	
		try {
			const response = await Axios.post(`http://localhost:8080/api/appointments`, {
				...appointment,
				pid: user._id,
			});
	
			if (response.status === 201) {
				window.alert("Your appointment was successfully scheduled.");
				setAppointment({});
			}
		} catch (error) {
			console.error("Error occurred while making appointment", error);
			
			if (error.response) {
				console.error("Response error:", error.response);
				window.alert(`Error: ${error.response.data || "An unknown error occurred"}`);
			} else {
				window.alert("An error occurred while scheduling the appointment. Please try again.");
			}
		}
	};
	
	

	return (
		<React.Fragment>
			<div id="super-container">
				<Navbar />
				<div className="parent-container">
					<form id="appointment-container">
						<img src={logo} alt="Health Insurance" className="logo" />
						
						{/* Date Input */}
						<div className="input-container">
							<i className="fa fa-calendar-check icon"></i>
							<input
								id="dateinput"
								type="date"
								name="date"
								placeholder="Date *"
								required
								onChange={(e) => {
									setAppointment({
										...appointment,
										date: Date.parse(e.target.value),
									});
								}}
								className="input-field"
							/>
						</div>
						
						{/* Time Slot Selection */}
						<div className="radio-container">
							<h3 className="radio-container-head">Choose Time Slot</h3>
							<div className="radio-options">
								<label>
									<input
										className="radio"
										type="radio"
										name="slot"
										value={1}
										onChange={(e) => {
											setAppointment({
												...appointment,
												slot: e.target.value,
											});
										}}
									/>
									<span className="radio-text">1</span>
								</label>
								<label>
									<input
										className="radio"
										type="radio"
										name="slot"
										value={2}
										onChange={(e) => {
											setAppointment({
												...appointment,
												slot: e.target.value,
											});
										}}
									/>
									<span className="radio-text">2</span>
								</label>
								<label>
									<input
										className="radio"
										type="radio"
										name="slot"
										value={3}
										onChange={(e) => {
											setAppointment({
												...appointment,
												slot: e.target.value,
											});
										}}
									/>
									<span className="radio-text">3</span>
								</label>
							</div>
							
							{/* Time Slot Descriptions */}
							<div className="slots-desc">
								<span>(1) 7AM - 10AM</span>
								<span>(2) 12PM - 4PM</span>
								<span>(3) 6PM - 11PM</span>
							</div>
						</div>
						
						{/* Submit Button */}
						<button
							id="submit"
							type="submit"
							onClick={onMakeAppointment}
							className="submit-btn"
						>
							Book Appointment
						</button>
					</form>
				</div>
			</div>
		</React.Fragment>
	);
};

export default BookAppointments;
