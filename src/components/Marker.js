import React, { createRef } from "react";
import { LineColors } from '../values/Colors';
import "./Map.css";

class Marker extends React.Component {
	state = {
		canvasRef: createRef()
	}

	draw() {
		let { canvasRef } = this.state;
		const { owner, nowTurn, tileSize: {width, height}, mark } = this.props;
		let canvas = canvasRef.current;

		if (canvas !== null) {
			let ctx = canvas.getContext('2d');
			let circle = new Path2D();

			// 캔버스 지우기
			ctx.clearRect(0, 0, width, height);

			if(owner === nowTurn) {
				circle.arc(width/2, height/2, width/2, 0, 2 * Math.PI);
				ctx.fillStyle = LineColors[mark];
				ctx.fill(circle);
			}

			circle = new Path2D();
			circle.arc(width/2, height/2, width/2-3, 0, 2 * Math.PI);
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
		const { canvasRef } = this.state;
		const { position, tileSize: {width, height} } = this.props;

		this.draw();

		const styles = {
			top: position.y * height,
			left: position.x * width
		};

		return (
			<div className="container__marker" style={styles}>
				<canvas
				ref={canvasRef}
				width={width}
				height={height} />
			</div>
		)
	}
}

export default Marker;