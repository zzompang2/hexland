import React, { createRef } from "react";
import { LineColors, FillColors } from '../values/Colors';
import "./Position.css";

class Position extends React.Component {
	state = {
		canvasRef: createRef()
	}

	// mark or clean
	draw(isMark) {
		let { canvasRef } = this.state;
		const { tileSize: {width, height}, mark } = this.props;

		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, width, height);

			if(isMark) {
				// 사각형
				ctx.fillStyle = LineColors[mark];
				ctx.fillRect(width/4, height/4, width/2, height/2);
				ctx.fillStyle = FillColors[mark];
				ctx.fillRect(width/4+2, height/4+2, width/2-4, height/2-4);
			}
		}
	}

	componentDidMount() {
		this.draw();
	}

	shouldComponentUpdate(nextProps) {
		return (this.props.isMark !== nextProps.isMark);
	}

	render() {
		const { canvasRef } = this.state;
		const { isMark, tileSize: {width, height} } = this.props;

		this.draw(isMark);

		return (
			<canvas
			className="pos"
			ref={canvasRef}
			width={width} 
			height={height} />
		)
	}
}

export default Position;