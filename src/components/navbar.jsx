import React, { useContext } from "react";

import LoginDetails from "../context/LoginContext";

const Navbar = () => {
	const { loggedIn, user } = useContext(LoginDetails);

	return !loggedIn ? (
		<div className={"navbar"}>
			<div className={"nav-container"}>
				<h1
					onClick={() => {
						window.location.href = "/";
					}}
					className={"nav-head"}>
					HMS
				</h1>
			</div>
			<ul className={"nav-links"}>
				<li>
					<a href={"/"}>Home</a>
				</li>
				<li>
					<a href={"/login"}>Login</a>
				</li>
				<li>
					<a href={"/Register"}>Sign Up</a>
				</li>
			</ul>
		</div>
	) : (
		<div className={"navbar"}>
			<div className={"nav-container"}>
				<h1
					onClick={() => {
						window.location.href = "/";
					}}
					className={"nav-head"}>
					HMS
				</h1>
			</div>
			<ul className={"nav-links"}>
				<li>
					<a href={"/appointmentpage"}>{user.name}</a>
				</li>
				<li>
					<a href={"/appointments"}>Book Appointment</a>
				</li>
			</ul>
		</div>
	);
};

export default Navbar;
