import React from "react";
import Tile from "./Tile";
import "./Map.css";

class Map extends React.Component {
	state = {
		// mapSize: this.props.mapSize,
		tiles: undefined,
		tilesMark: this.props.tilesMark,
		// candidatePos: this.props.candidatePos,
	}

	// isCandidate(x, y) {
	// 	const { candidatePos: [pos1, pos2] } = this.state;
	// 	if (pos1 !== undefined && x === pos1.x && y === pos1.y)
	// 		return true;
	// 	if (pos2 !== undefined && x === pos2.x && y === pos2.y)
	// 		return true;
	// 	return false;
	// }

	// tiles() {
	// 	const { mapSize: {x, y} } = this.state;
	// 	const tiles = [];

	// 	for (let j=0; j<y; j++) {
	// 		const tiles_row = [];

	// 		for (let i=0; i<x; i++) {
	// 			tiles_row.push(
	// 				<div
	// 				key={i}
	// 				onClick={this.props.handleClick}>
	// 					<Tile
	// 					key={i}
	// 					id={{x: i, y: j}}
	// 					owner={0}
	// 					isMark={this.isCandidate(i, j)} />
	// 				</div>
	// 			);
	// 		}
	// 		tiles.push(tiles_row);
	// 	}
	// 	return tiles;
	// }

	// componentDidMount() {
	// 	const { x, y } = this.state.mapSize;
	// 	const tiles = [];

	// 	for (let j=0; j<y; j++) {
	// 		const tiles_row = [];

	// 		for (let i=0; i<x; i++) {
	// 			tiles_row.push(
	// 				<div
	// 				key={i}
	// 				onClick={this.props.handleClick}>
	// 					<Tile
	// 					key={i}
	// 					id={{x: i, y: j}}
	// 					owner={0}
	// 					isMark={false} />
	// 				</div>
	// 			);
	// 		}
	// 		tiles.push(tiles_row);
	// 	}
	// 	this.setState({ tiles });
	// }

	// shouldComponentUpdate() {
	// 	const { tiles, candidatePos } = this.state;
	// 	// const { candidatePos } = this.props;
	// 	console.log(candidatePos);
	// 	if (candidatePos[0] !== undefined || tiles === undefined) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	markCandidateTile(pos) {
		const { tiles } = this.state;
		console.log("markCandidateTile", pos);

		tiles[pos.y][pos.x] = 
			<div
			key={pos.x}
			onClick={this.props.handleClick}>
				<Tile
				key={pos.x}
				id={{x: pos.x, y: pos.y}}
				owner={0}
				isMark={true} />
			</div>;
	}

	render() {
		// const { tiles, tilesMark } = this.state;
		const { tilesMark } = this.props;
		console.log("Map: render", tilesMark);

		// if (tiles === undefined)
		// 	return null;

		// if (pos1 !== undefined) {
		// 	this.markCandidateTile(pos1);
		// 	if (pos2 !== undefined)
		// 		this.markCandidateTile(pos2);
		// }

		return (
			<div className="tiles_column">
				{/* {tiles.map((row, y) => (
					<div 
					key={y}
					className="tiles_row">
						{row}
					</div>
				))} */}
				{tilesMark.map((rowMark, j) => (
					<div className="tiles_row">
						{rowMark.map((mark, i) => (
							<div
							key={i}
							onClick={this.props.handleClick}>
								<Tile
								key={i}
								id={{x: i, y: j}}
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