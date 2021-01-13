import React, { createRef } from "react";
import { LineColors, FillColors } from '../values/Colors';

class Tile extends React.Component {
	state = {
		canvasRef: createRef(),
	}

	draw() {
		let { canvasRef } = this.state;
		const { tileSize: {width, height}, owner, lineOwner: {top, left} } = this.props;

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

			// left line
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(0, height);
			ctx.lineWidth = 4;
			ctx.strokeStyle = LineColors[left];
			ctx.stroke();

			// 사각형
			ctx.fillStyle = FillColors[owner];
			ctx.fillRect(2, 2, width-2, height-2);
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
		const { tileSize: {width, height} } = this.props;

		this.draw();

		return (
			<canvas
			className="tile"
			ref={canvasRef}
			width={width} 
			height={height} />
		)
	}
}

export default Tile;