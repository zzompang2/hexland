import React, { createRef } from "react";
import "./Tile.css";

const ownerColors = ["#e0e0e0", "red", "blue", "green"];
const WIDTH = 20;
const HEIGHT = 20;

class Tile extends React.Component {
	state = {
		id: this.props.id,
		connections: [false, false, false, false],
		owner: this.props.owner,
		isMark: this.props.isMark,
		canvasRef: this.myCreateRef()
	}

	myCreateRef() {
		console.log("createRef()");
		return createRef();
	}

	draw() {
		let { canvasRef, owner } = this.state;
		let canvas = canvasRef.current;
		let ctx = canvas.getContext('2d');

		// 캔버스 지우기
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		// 사각형
		ctx.fillStyle = ownerColors[owner];
		ctx.fillRect(1, 1, WIDTH-2, HEIGHT-2);
	}

	mark() {
		console.log("mark");
		let { canvasRef, owner } = this.state;
		let canvas = canvasRef.current;
		let ctx = canvas.getContext('2d');

		// 캔버스 지우기
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		// 사각형
		ctx.fillStyle = ownerColors[owner];
		ctx.fillRect(1, 1, WIDTH-2, HEIGHT-2);

		// 원
		var circle = new Path2D();
		circle.arc(WIDTH/2, HEIGHT/2, WIDTH/4, 0, 2 * Math.PI);
		ctx.fillStyle = ownerColors[3];
		ctx.fill(circle);
	}

	componentDidMount() {
		this.draw();
	}

	render() {
		const { id, canvasRef } = this.state;
		const { isMark } = this.props;
		console.log("Tile: render", id);
		if (isMark)
			this.mark();

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