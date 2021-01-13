import React from "react";
import Navigation from "../components/Navigation";
import "./About.css";

class About extends React.Component {
	render() {
		return (
			<div className="container__about">
				<Navigation />
				<p>✨함창수✨</p>
			</div>
		)
	}
}

export default About;