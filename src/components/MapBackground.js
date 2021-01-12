import React from "react";
import Tile from "./Tile";
import TileRight from "./TileRight";
import TileBottom from "./TileBottom";
import "./Map.css";

const background = 4;

class MapBackground extends React.Component {

	render() {
		const { mapSize, tilesOwner } = this.props;
		console.log("MapLine: render");

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
										return (<Tile key={i} owner={background} lineOwner={{top: background, left: background}} />);
									else
										return (<TileRight key={i} index={j} left={background} />);
								}
								else {
									if(i !== mapSize.x)
										return (<TileBottom key={i} index={i} top={background} />);
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