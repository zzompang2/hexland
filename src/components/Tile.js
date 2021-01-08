import React from "react";
import "./Tile.css";

const ownerColors = ["#e0e0e0", "red", "blue"];
const WIDTH = 20;
const HEIGHT = 20;

class Tile extends React.Component {
	state = {
		id: this.props.id,
		connections: [false, false, false, false],
		owner: 0
	}

	draw() {
		const { id, owner } = this.state;

		var canvas = document.getElementById(`canvasX${id.x}Y${id.y}`);
		if (canvas.getContext) {
			var ctx = canvas.getContext('2d');

			// 사각형
			ctx.fillStyle = ownerColors[0];
			ctx.fillRect(1, 1, WIDTH-2, HEIGHT-2);

			// 원
			var circle = new Path2D();
			circle.arc(WIDTH/2, HEIGHT/2, WIDTH/4, 0, 2 * Math.PI);
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
			<canvas
			className="tile"
			id={`canvasX${id.x}Y${id.y}`} 
			width={WIDTH} 
			height={HEIGHT} />
		)
	}
}

export default Tile;