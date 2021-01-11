import React, { createRef } from "react";
import "./Tile.css";

const lineColors = {
	A: "red",
	B: "blue",
	no: "#e0e0e0",
	block: "orange"
};
const fillColors = {
	A: "pink",
	B: "skyblue",
	no: "white",
};
const WIDTH = 20;
const HEIGHT = 20;

class Tile extends React.Component {
	state = {
		canvasRef: createRef()
	}

	draw() {
		let { canvasRef } = this.state;
		const { owner, lineOwner: {top, left} } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, WIDTH, HEIGHT);

			// top line
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(WIDTH, 0);
			ctx.lineWidth = 4;
			ctx.strokeStyle = lineColors[top];
			ctx.stroke();

			// left line
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, HEIGHT);
			ctx.lineWidth = 4;
			ctx.strokeStyle = lineColors[left];
			ctx.stroke();

			// 사각형
			ctx.fillStyle = fillColors[owner];
			ctx.fillRect(2, 2, WIDTH-2, HEIGHT-2);
		}
	}

	componentDidMount() {
		this.draw();
	}

	shouldComponentUpdate(nextProps) {
		return (this.props.owner !== nextProps.owner ||
						this.props.lineOwner.top !== nextProps.lineOwner.top ||
						this.props.lineOwner.left !== nextProps.lineOwner.left);
	}

	render() {
		const { canvasRef } = this.state;
		console.log("Tile: render");

		this.draw();

		return (
			<canvas
			className="tile"
			ref={canvasRef}
			width={WIDTH} 
			height={HEIGHT} />
		)
	}
}

export default Tile;