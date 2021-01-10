import React from "react";
import Position from "./Position";
import "./Map.css";

class MapPosition extends React.Component {
	state = {
		positionsMark: this.props.positionsMark
	}

	render() {
		const { positionsMark, handleClick, positionsOwner } = this.props;
		console.log("MapPosition: render");

		return (
			<div className="pos_column">
				{positionsOwner.map((ownerRow, j) => (
					<div 
					key={j}
					className="pos_row">
						{ownerRow.map((owner, i) => (
							<div
							key={i}
							onClick={e => handleClick(e, i, j)}>
								<Position
								owner={owner}
								isMark={positionsMark[j][i]} />
							</div>
						))}
					</div>
				))}
			</div>
		)
	}
}

export default MapPosition;