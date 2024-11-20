import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Navigate,  // Updated to use Navigate
	Route,
	Routes,   // Use Routes instead of Switch in v6
} from "react-router-dom";
import DoctorDashboard from "./components/DoctorDashboard";
import BookAppointments from "./containers/BookAppointments";
import LandingPage from "./containers/LandingPage";
import LoginDetails from "./context/LoginContext";
import HomePage from "./components/Home";
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
	const [user, setUser] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		const savedUser = localStorage.getItem("user");
		if (!loggedIn && savedUser) {
			setUser(JSON.parse(savedUser).user);
			setLoggedIn(true);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<LoginDetails.Provider value={{ loggedIn, user, setUser }}>
			<Router>
				<div>
					<Routes> {/* Replace Switch with Routes */}
						<Route path={"/"} element={<HomePage />} />
						<Route path={"/login"} element={<Login />} />
						<Route path={"/register"} element={<Register />} />
						<Route path={"/appointments"} element={<BookAppointments />} />
						<Route path={"/appointmentpage"} element={<LandingPage />} />
						<Route path={"/404"} element={<h1>Page not found</h1>} />
						<Route path={"/*"} element={<Navigate to={"/404"} />} /> {/* Updated to Navigate */}
            <Route path="/doctor" element={<DoctorDashboard/>}/>
					</Routes>
				</div>
			</Router>
		</LoginDetails.Provider>
	);
};

export default App;
