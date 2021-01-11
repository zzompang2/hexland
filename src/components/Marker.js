import React, { createRef } from "react";
import "./Marker.css";

const ownerColors = {
	A: "red",
	B: "blue",
	no: "#e0e0e0",
	mark: "green"
};
const WIDTH = 20;
const HEIGHT = 20;

class Marker extends React.Component {
	state = {
		canvasRef: createRef()
	}
	componentDidMount() {
		let { canvasRef } = this.state;
		const { owner } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');
			let circle = new Path2D();

			circle.arc(WIDTH/2, HEIGHT/2, WIDTH/2-3, 0, 2 * Math.PI);
			ctx.fillStyle = "black";
			ctx.fill(circle);

			circle = new Path2D();
			circle.arc(WIDTH/2, HEIGHT/2, WIDTH/2-5, 0, 2 * Math.PI);
			ctx.fillStyle = ownerColors[owner];
			ctx.fill(circle);
		}

		const marker = document.querySelector(".markerContainer");
		marker.width = 200;
	}

	shouldComponentUpdate(newProps) {
		if(newProps.position.x !== this.props.position.x ||
			 newProps.position.y !== this.props.position.y)
			return true;
		return false;
	}

	render() {
		console.log("Marker: render", this.props.owner);
		const { canvasRef } = this.state;
		const { position } = this.props;

		const styles = {
			top: position.y * HEIGHT,
			left: position.x * WIDTH
		};

		return (
			<div className="markerContainer" style={styles}>
				<canvas
				ref={canvasRef}
				width={WIDTH}
				height={HEIGHT} />
			</div>
		)
	}
}

export default Marker;