import React, { createRef } from "react";
import "./Dice.css";

class Dice extends React.Component {
	state = {
		canvasRef: createRef()
	}

	draw() {
		let { canvasRef } = this.state;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, 50, 50);

			// top line
			ctx.beginPath();
			ctx.moveTo(10, 81);
			ctx.lineTo(55, 5);
			ctx.lineTo(100, 81);
			ctx.closePath();
			ctx.strokeStyle = "black";
			ctx.lineWidth = 4;
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.stroke();
		}
	}

	componentDidMount() {
		this.draw();
	}

	shouldComponentUpdate(nextProps) {
		return (this.props.value !== nextProps.value);
	}

	render() {
		const { canvasRef } = this.state;
		const { value } = this.props;

		this.draw();

		return (
			<div className="dice">
				<canvas
				ref={canvasRef}
				width={110} 
				height={96} />
				<p>{value}</p>
			</div>
		)
	}
}

export default Dice;