import React from "react";
import Tile from "./Tile";
import TileRight from "./TileRight";
import TileBottom from "./TileBottom";
import "./Map.css";

const background = 4;

class MapBackground extends React.Component {

	render() {
		const { tileSize, mapSize, tilesOwner } = this.props;

		return (
			<div className="container__mapbg">
				<div className="tiles_column">
					{tilesOwner.map((ownerRow, j) => (
						<div 
						key={j}
						className="tiles_row">
							{ownerRow.map((owner, i) => {
								if(j !== mapSize.y) {
									if(i !== mapSize.x)
										return (<Tile key={i} tileSize={tileSize} owner={background} lineOwner={{top: background, left: background}} />);
									else
										return (<TileRight key={i} tileSize={tileSize} left={background} />);
								}
								else {
									if(i !== mapSize.x)
										return (<TileBottom key={i} tileSize={tileSize} top={background} />);
									else
										return null;
								}
							})}
						</div>
					))}
				</div>
			</div>
		)
	}
}

export default MapBackground;