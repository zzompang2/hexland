import React from "react";
import Tile from "./Tile";
import "./Map.css";

class Map extends React.Component {
	state = {
		tilesMark: this.props.tilesMark,
	}

	render() {
		const { tilesMark, handleClick } = this.props;
		console.log("Map: render");

		return (
			<div className="tiles_column">
				{tilesMark.map((rowMark, j) => (
					<div 
					key={j}
					className="tiles_row">
						{rowMark.map((mark, i) => (
							<div
							key={i}
							onClick={e => handleClick(e, i, j)}>
								<Tile
								owner={0}
								isMark={mark} />
							</div>
						))}
					</div>
				))}
			</div>
		)
	}
}

export default Map;