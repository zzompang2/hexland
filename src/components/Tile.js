import React, { createRef } from "react";
import "./Tile.css";

const ownerColors = ["#e0e0e0", "red", "blue", "green"];
const WIDTH = 20;
const HEIGHT = 20;

class Tile extends React.Component {
	state = {
		connections: [false, false, false, false],
		canvasRef: createRef(),
	}

	draw() {
		let { canvasRef } = this.state;
		const { owner } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');

			// 캔버스 지우기
			ctx.clearRect(0, 0, WIDTH, HEIGHT);

			// 검정테두리
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, WIDTH, HEIGHT);

			// 사각형
			ctx.fillStyle = ownerColors[owner];
			ctx.fillRect(1, 1, WIDTH-2, HEIGHT-2);
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

			// 검정테두리
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, WIDTH, HEIGHT);

			// 사각형
			ctx.fillStyle = ownerColors[owner];
			ctx.fillRect(1, 1, WIDTH-2, HEIGHT-2);

			// 원
			var circle = new Path2D();
			circle.arc(WIDTH/2, HEIGHT/2, WIDTH/4, 0, 2 * Math.PI);
			ctx.fillStyle = ownerColors[3];
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
		console.log("Tile: render");

		if (isMark){
			// console.log(this.state, this.props);
			this.mark();
		}
		else
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