import React from "react";
import Tile from "./Tile";
import TileRight from "./TileRight";
import TileBottom from "./TileBottom";
import "./Map.css";

class MapTile extends React.Component {

	render() {
		const { tileSize, mapSize, tilesOwner, lineOwner } = this.props;

		return (
			<div className="tiles_column">
				{tilesOwner.map((ownerRow, j) => (
					<div 
					key={j}
					className="tiles_row">
						{ownerRow.map((owner, i) => {
							if(j !== mapSize.y) {
								if(i !== mapSize.x)
									return (<Tile key={i} tileSize={tileSize} owner={owner} lineOwner={lineOwner[j][i]} />);
								else
									return (<TileRight key={i} tileSize={tileSize} left={lineOwner[j][i].left} />);
							}
							else {
								if(i !== mapSize.x)
									return (<TileBottom key={i} tileSize={tileSize} top={lineOwner[j][i].top} />);
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