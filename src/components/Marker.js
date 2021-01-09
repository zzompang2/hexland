import React from "react";
import "./Marker.css";

const ownerColors = ["#e0e0e0", "red", "blue"];
const WIDTH = 20;
const HEIGHT = 20;

class Marker extends React.Component {
	componentDidMount() {
		const { id } = this.props;

		var canvas = document.getElementById(`marker${id}`);
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');

			var circle = new Path2D();
			circle.arc(WIDTH/2, HEIGHT/2, WIDTH/2, 0, 2 * Math.PI);
			ctx.fillStyle = ownerColors[id];
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
		console.log("Marker: render");
		const { id, position } = this.props;

		const styles = {
			top: position.y * HEIGHT,
			left: position.x * WIDTH
		};

		return (
			<div className="markerContainer" style={styles}>
				<canvas id={`marker${id}`} width={WIDTH} height={HEIGHT}></canvas>
			</div>
		)
	}
}

export default Marker;