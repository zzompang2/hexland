import React from "react";
import { Link } from 'react-router-dom';
import "./Navigation.css";

class Navigation extends React.Component {
	render() {
		return (
			<div className="navigation">
				<Link
					to={{pathname: "/"}} >
					처음으로
				</Link>
			</div>
		)
	}
}

export default Navigation;