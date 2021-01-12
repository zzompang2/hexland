import React, { createRef } from "react";
import { LineColors } from '../values/Colors';
import "./Tile.css";

const WIDTH = 20;
const HEIGHT = 20;

class TileBottom extends React.Component {
	state = {
		canvasRef: createRef()
	}

	draw() {
		let { canvasRef } = this.state;
		const { index, top } = this.props;
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
			ctx.strokeStyle = LineColors[top];
			ctx.stroke();

			ctx.font = "10px gothic";
			ctx.fillStyle = "black";
			ctx.fillText(index, 10, 10);
		}
	}

	componentDidMount() {
		this.draw();
	}

	shouldComponentUpdate(nextProps) {
		return (this.props.top !== nextProps.top);
	}

	render() {
		const { canvasRef } = this.state;
		console.log("TileRight: render");

		this.draw();

		return (
			<canvas
			ref={canvasRef}
			width={WIDTH} 
			height={HEIGHT} />
		)
	}
}

export default TileBottom;