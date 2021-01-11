import React, { createRef } from "react";
import "./Position.css";

const ownerColors = ["#909090", "red", "blue", "green"];
const WIDTH = 20;
const HEIGHT = 20;

class Position extends React.Component {
	state = {
		canvasRef: createRef()
	}

	// mark or clean
	draw(isMark) {
		let { canvasRef } = this.state;
		const { owner } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, WIDTH, HEIGHT);

			if(isMark) {
				// 테두리 원
				let circle = new Path2D();
				circle.arc(WIDTH/2, HEIGHT/2, 6, 0, 2 * Math.PI);
				ctx.fillStyle = ownerColors[3];
				ctx.fill(circle);

				// owner 원
				circle = new Path2D();
				circle.arc(WIDTH/2, HEIGHT/2, 3, 0, 2 * Math.PI);
				ctx.fillStyle = ownerColors[owner];
				ctx.fill(circle);
			}
		}
	}

	shouldComponentUpdate(nextProps) {
		return (this.props.isMark !== nextProps.isMark);
	}

	render() {
		const { canvasRef } = this.state;
		const { isMark } = this.props;

		this.draw(isMark);

		return (
			<canvas
			className="pos"
			ref={canvasRef}
			width={WIDTH} 
			height={HEIGHT} />
		)
	}
}

export default Position;