import React from "react";
import Tile from "./Tile";
import TileRight from "./TileRight";
import TileBottom from "./TileBottom";
import "./Map.css";

const WIDTH = 20;
const HEIGHT = 20;

class MapTile extends React.Component {

	render() {
		const { mapSize, tilesOwner, lineOwner } = this.props;
		console.log("Map: render");

		return (
			<div className="tiles_column">
				{tilesOwner.map((ownerRow, j) => (
					<div 
					key={j}
					className="tiles_row">
						{ownerRow.map((owner, i) => {
							if(j !== mapSize.y) {
								if(i !== mapSize.x)
									return (<Tile key={i} owner={owner} lineOwner={lineOwner[j][i]} />);
								else
									return (<TileRight key={i} index={j} left={lineOwner[j][i].left} />);
							}
							else {
								if(i !== mapSize.x)
									return (<TileBottom key={i} index={i} top={lineOwner[j][i].top} />);
								else
									return null;
							}
						})}
					</div>
				))}
			</div>
		)
	}
}

export default MapTile;