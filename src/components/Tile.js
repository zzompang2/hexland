import React, { createRef } from "react";
import "./Tile.css";

const ownerColors = ["#e0e0e0", "red", "blue", "green"];
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

			// 검정테두리
			// ctx.fillStyle = "#909090";
			// ctx.fillRect(0, 0, WIDTH, HEIGHT);

			// top line
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(WIDTH, 0);
			ctx.lineWidth = 4;
			ctx.strokeStyle = ownerColors[top];
			ctx.stroke();

			// left line
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, HEIGHT);
			ctx.lineWidth = 4;
			ctx.strokeStyle = ownerColors[left];
			ctx.stroke();

			// 사각형
			ctx.fillStyle = owner === 0 ? "white" : ownerColors[owner];
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