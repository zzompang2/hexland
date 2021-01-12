import React, { createRef } from "react";
import "./Position.css";

const markColor = "green";
const WIDTH = 20;
const HEIGHT = 20;

class Position extends React.Component {
	state = {
		canvasRef: createRef()
	}

	// mark or clean
	draw(isMark) {
		let { canvasRef } = this.state;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, WIDTH, HEIGHT);

			if(isMark) {
				// 사각형
				ctx.fillStyle = markColor;
				ctx.fillRect(WIDTH/4, HEIGHT/4, WIDTH/2, HEIGHT/2);
				ctx.fillStyle = "white";
				ctx.fillRect(WIDTH/4+2, HEIGHT/4+2, WIDTH/2-4, HEIGHT/2-4);
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