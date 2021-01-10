import React from "react";
import Tile from "./Tile";
import "./Map.css";

const WIDTH = 20;
const HEIGHT = 20;

class MapTile extends React.Component {

	render() {
		const { tilesOwner } = this.props;
		console.log("Map: render");

		const styles = {
			top: HEIGHT/2,
			left: WIDTH/2
		}

		return (
			<div className="tiles_column" style={styles}>
				{tilesOwner.map((ownerRow, j) => (
					<div 
					key={j}
					className="tiles_row">
						{ownerRow.map((owner, i) => (
							<div key={i}>
								<Tile owner={owner} />
							</div>
						))}
					</div>
				))}
			</div>
		)
	}
}

export default MapTile;