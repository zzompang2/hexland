import React from "react";
import Position from "./Position";
import "./Map.css";

class MapPosition extends React.Component {
	state = {
		positionsMark: this.props.positionsMark
	}

	render() {
		const { positionsMark, handleClick } = this.props;
		// console.log("MapPosition: render");

		return (
			<div className="pos_column">
				{positionsMark.map((row, j) => (
					<div 
					key={j}
					className="pos_row">
						{row.map((mark, i) => (
							<div
							key={i}
							onClick={e => handleClick(e, i, j)}>
								<Position isMark={mark} />
							</div>
						))}
					</div>
				))}
			</div>
		)
	}
}

export default MapPosition;