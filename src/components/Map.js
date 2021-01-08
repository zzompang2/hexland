import React from "react";
import Tile from "./Tile";
import "./Map.css";

class Map extends React.Component {
	state = {
		mapSize: this.props.mapSize,
		tiles: []
	}

	componentDidMount() {
		const { x, y } = this.state.mapSize;
		const tiles = [];

		for (let j=0; j<y; j++) {
			const tiles_row = [];
			for (let i=0; i<x; i++)
				tiles_row.push(<Tile key={i} id={{x: i, y: j}}/>);
			tiles.push(tiles_row);
		}

		this.setState({ tiles });
	}

	render() {
		const { tiles } = this.state;

		return (
			<div className="tiles_column">
				{tiles.map((row, idx) => (
					<div 
					key={idx}
					className="tiles_row">
						{row}
					</div>
				))}
			</div>
		)
	}
}

export default Map;