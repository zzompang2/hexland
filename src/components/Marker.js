import React, { createRef } from "react";
import { LineColors } from '../values/Colors';
import "./Map.css";

const WIDTH = 20;
const HEIGHT = 20;
const mark = 1;

class Marker extends React.Component {
	state = {
		canvasRef: createRef()
	}

	draw() {
		let { canvasRef } = this.state;
		const { owner, nowTurn } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');
			let circle = new Path2D();

			// 캔버스 지우기
			ctx.clearRect(0, 0, WIDTH, HEIGHT);

			if(owner === nowTurn) {
				circle.arc(WIDTH/2, HEIGHT/2, WIDTH/2, 0, 2 * Math.PI);
				ctx.fillStyle = LineColors[mark];
				ctx.fill(circle);
			}

			circle = new Path2D();
			circle.arc(WIDTH/2, HEIGHT/2, WIDTH/2-3, 0, 2 * Math.PI);
			ctx.fillStyle = LineColors[owner];
			ctx.fill(circle);
		}
	}

	componentDidMount() {
		this.draw();
	}

	shouldComponentUpdate(newProps) {
		return (newProps.position.x !== this.props.position.x ||
						 newProps.position.y !== this.props.position.y ||
						 newProps.nowTurn !== this.props.nowTurn);
	}

	render() {
		console.log("Marker: render", this.props.owner);
		const { canvasRef } = this.state;
		const { position } = this.props;

		this.draw();

		const styles = {
			top: position.y * HEIGHT,
			left: position.x * WIDTH
		};

		return (
			<div className="container__marker" style={styles}>
				<canvas
				ref={canvasRef}
				width={WIDTH}
				height={HEIGHT} />
			</div>
		)
	}
}

export default Marker;