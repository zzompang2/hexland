import React, { createRef } from "react";
import { LineColors } from '../values/Colors';

class TileBottom extends React.Component {
	state = {
		canvasRef: createRef()
	}

	draw() {
		let { canvasRef } = this.state;
		const { tileSize: {width, height}, top } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, width, height);

			// top line
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(width, 0);
			ctx.lineWidth = 4;
			ctx.strokeStyle = LineColors[top];
			ctx.stroke();
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
		const { tileSize: {width} } = this.props;

		this.draw();

		return (
			<canvas
			ref={canvasRef}
			width={width} 
			height={4} />
		)
	}
}

export default TileBottom;