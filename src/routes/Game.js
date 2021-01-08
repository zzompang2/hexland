import React from "react";
import Map from "../components/Map";
import Marker from "../components/Marker";
import "./Game.css";

const mapSize = {x: 20, y: 20};
const startPosition = {x: Math.floor(mapSize.x/2), y: Math.floor(mapSize.y/2)};

class Game extends React.Component {
	state = {
		mapSize: mapSize,
		diceValues: [0, 0],
		position: startPosition
	}

	throwDices = () => {
		const one = Math.floor(Math.random() * 4) + 1;
		const two = Math.floor(Math.random() * 4) + 1;
		this.setState({diceValues: [one, two]});
	}

	render() {
		const { mapSize, diceValues, position } = this.state;
		const {
			throwDices
		} = this;

		console.log("cur pos:", position);

		return (
			<div className="container">
				<div>Game Main</div>
				<div>one:{diceValues[0]} two:{diceValues[1]}</div>
				<button
				onClick={throwDices}>
					주사위 던지기
				</button>
				<div className="mapContainer">
					<Map mapSize={mapSize} />
					<Marker id={1} position={position} />
				</div>
			</div>
		)
	}
}

export default Game;