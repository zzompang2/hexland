import React from "react";
import "./TileHex.css";

const ownerColors = ["#e0e0e0", "red", "blue"];
const WIDTH = 43.301;
const HEIGHT = 50;

class TileHex extends React.Component {
	state = {
		id: this.props.id,
		connections: [false, false, false, false, false, false],
		owner: 0
	}

	draw() {
		const { id, owner } = this.state;

		var canvas = document.getElementById("canvas"+id);
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');
			// ctx.fillStyle = "#ffc16f";
			// ctx.fillRect(0, 0, 86.603, 100);

			// 가운데 사각형
			ctx.fillStyle = ownerColors[0];
			ctx.fillRect(0, HEIGHT/4, WIDTH, HEIGHT/2);

			// 위 삼각형
			ctx.beginPath();
			ctx.moveTo(WIDTH/2, 0);
			ctx.lineTo(0, HEIGHT/4);
			ctx.lineTo(WIDTH, HEIGHT/4);
			ctx.fillStyle = ownerColors[0];
			ctx.fill();

			// 아래 삼각형
			ctx.moveTo(WIDTH/2, HEIGHT);
			ctx.lineTo(0, HEIGHT*3/4);
			ctx.lineTo(WIDTH, HEIGHT*3/4);
			ctx.fillStyle = ownerColors[0];
			ctx.fill();

			var circle = new Path2D();
			// circle.moveTo(43.3015, 50);
			circle.arc(WIDTH/2, HEIGHT/2, WIDTH/2, 0, 2 * Math.PI);
			ctx.fillStyle = ownerColors[owner];
			ctx.fill(circle);
		}
	}

	componentDidMount() {
		this.draw();
	}

	render() {
		console.log("Tile: render");
		const { id } = this.state;

		return (
			<div>
				<canvas id={"canvas"+id} width={WIDTH} height={HEIGHT}></canvas>
				{/* <div className="hexagon" /> */}
			</div>
		)
	}
}

export default TileHex;