import React, { createRef } from "react";
import { LineColors } from '../values/Colors';

class TileRight extends React.Component {
	state = {
		canvasRef: createRef()
	}

	draw() {
		let { canvasRef } = this.state;
		const { tileSize: {width, height}, left } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, width, height);

			// left line
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, height);
			ctx.lineWidth = 4;
			ctx.strokeStyle = LineColors[left];
			ctx.stroke();
		}
	}

	componentDidMount() {
		this.draw();
	}

	shouldComponentUpdate(nextProps) {
		return (this.props.left !== nextProps.left);
	}

	render() {
		const { canvasRef } = this.state;
		const { tileSize: {height} } = this.props;

		this.draw();

		return (
			<canvas
			ref={canvasRef}
			width={4} 
			height={height} />
		)
	}
}

export default TileRight;