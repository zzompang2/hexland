import React from "react";
import { Link } from 'react-router-dom';
import "./Navigation.css";

class Navigation extends React.Component {
	// componentDidMount() {
	// }

	// shouldComponentUpdate(nextProps) {
	// 	return (this.props.owner !== nextProps.owner ||
	// 					this.props.lineOwner.top !== nextProps.lineOwner.top ||
	// 					this.props.lineOwner.left !== nextProps.lineOwner.left);
	// }

	render() {
		// const { canvasRef } = this.state;
		console.log("Navigation: render");

		return (
			<div className="navigation">
				<Link
					to={{pathname: "/"}} >
					뒤로 가기
				</Link>
			</div>
		)
	}
}

export default Navigation;