import React, { createRef } from "react";
import "./Position.css";

const ownerColors = ["#909090", "red", "blue", "green"];
const WIDTH = 20;
const HEIGHT = 20;

class Position extends React.Component {
	state = {
		connections: [false, false, false, false],
		canvasRef: createRef()
	}

	draw() {
		let { canvasRef } = this.state;
		const { owner } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, WIDTH, HEIGHT);

			if(owner !== 0) {
				// 원
				let circle = new Path2D();
				circle.arc(WIDTH/2, HEIGHT/2, 3, 0, 2 * Math.PI);
				ctx.fillStyle = ownerColors[owner];
				ctx.fill(circle);
			}
		}
	}

	mark() {
		console.log("mark");
		let { canvasRef } = this.state;
		const { owner } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, WIDTH, HEIGHT);

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

	componentDidMount() {
		this.draw();
	}

	shouldComponentUpdate(nextProps) {
		const { owner, isMark } = this.props;
		const { owner: owner_, isMark: isMark_ } = nextProps;

		if (owner !== owner_ || isMark !== isMark_)
			return true;
		else
			return false;
	}

	render() {
		const { canvasRef } = this.state;
		const { isMark } = this.props;
		console.log("Position: render");

		if (isMark)
			this.mark();
		else
			this.draw();

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