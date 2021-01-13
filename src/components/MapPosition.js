import React from "react";
import Position from "./Position";
import Marker from "../components/Marker";
import "./Map.css";

class MapPosition extends React.Component {
	render() {
		const { tileSize, positionsMark, handleClick, markerPositions, firstTeamIdx, nowTurn, indexObj } = this.props;

		return (
			<div className="pos_column">
				{markerPositions.map((position, idx) =>
					<Marker key={idx} tileSize={tileSize} owner={firstTeamIdx + idx} position={position} nowTurn={nowTurn} mark={indexObj.mark} />
				)}
				{positionsMark.map((row, j) => (
					<div 
					key={j}
					className="pos_row">
						{row.map((mark, i) => (
							<div
							key={i}
							onClick={e => handleClick(i, j)}>
								<Position tileSize={tileSize} isMark={mark} mark={indexObj.mark} />
							</div>
						))}
					</div>
				))}
			</div>
		)
	}
}

export default MapPosition;