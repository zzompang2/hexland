import React from "react";
import Map from "../components/Map";
import Marker from "../components/Marker";
import "./Game.css";

const mapSize = {x: 20, y: 20};
const startPosition = {x: Math.floor(mapSize.x/2), y: Math.floor(mapSize.y/2)};

class Game extends React.Component {
	state = {
		mapSize: mapSize,
		position: startPosition,
		diceValues: [],
		tilesOwner: [],
		tilesMark: [],
		candidatePos: []
	}

	throwDices = () => {
		console.log("주사위 던짐!");
		const { mapSize: {x: mapX, y: mapY}, position, tilesMark, candidatePos } = this.state;

		if(candidatePos.length !== 0) {
			console.log("이동할 좌표 선택해 주세요.");
			return;
		}

		const one = Math.floor(Math.random() * 4) + 1;
		const two = Math.floor(Math.random() * 4) + 1;
		console.log("주사위 결과:", one, two);

		let x, y;

		switch(one) {
			case 1:
				x = position.x;
				y = position.y - two < 0 ? 0 : position.y - two;
				break;
			case 2:
				x = position.x + two >= mapX ? mapX - 1 : position.x + two;
				y = position.y;
				break;
			case 3:
				x = position.x;
				y = position.y + two >= mapY ? mapY - 1 : position.y + two;
				break;
			case 4:
				x = position.x - two < 0 ? 0 : position.x - two;
				y = position.y;
				break;
			default:
				return;
		}
		console.log("계산한 후보좌표:", x, y);
		if(JSON.stringify(position) === JSON.stringify({x, y}))
			console.log("현재 위치랑 같음!");
		else {
			candidatePos.push({x, y});
			tilesMark[y][x] = true;
		}

		if(one !== two) {
			switch(two) {
				case 1:
					x = position.x;
					y = position.y - one < 0 ? 0 : position.y - one;
					break;
				case 2:
					x = position.x + one >= mapX ? mapX - 1 : position.x + one;
					y = position.y;
					break;
				case 3:
					x = position.x;
					y = position.y + one >= mapY ? mapY - 1 : position.y + one;
					break;
				case 4:
					x = position.x - one < 0 ? 0 : position.x - one;
					y = position.y;
					break;
				default:
					return;
			}
			console.log("계산한 후보좌표:", x, y);
			if(JSON.stringify(position) === JSON.stringify({x, y}))
				console.log("현재 위치랑 같음!");
			else {
				candidatePos.push({x, y});
				tilesMark[y][x] = true;
			}
		}

		if(candidatePos.length === 0)
			return;

		this.setState({ diceValues: [one, two], tilesMark, candidatePos });
	}

	handleClick = (e, x, y) => {
		const { position, tilesOwner, tilesMark, candidatePos } = this.state;
		console.log("타일 클릭:", x, y);

		if(candidatePos.length === 0)
			return;

		let newPosition;
	
		for(let i=0; i<candidatePos.length; i++) {
			const pos = candidatePos[i];
			if(pos.x === x && pos.y === y) {
				newPosition = pos;
				break;
			}
		}
		if(newPosition === undefined)
			return;
		
		console.log("이동한 좌표:", newPosition);
		candidatePos.map(pos => { tilesMark[pos.y][pos.x] = false; })

		if(position.x !== newPosition.x) {
			const min = Math.min(position.x, newPosition.x);
			const max = Math.max(position.x, newPosition.x);
			for(let i=min; i<=max; i++)
				tilesOwner[position.y][i] = 1;
		}
		else {
			const min = Math.min(position.y, newPosition.y);
			const max = Math.max(position.y, newPosition.y);
			for(let i=min; i<=max; i++)
				tilesOwner[i][position.x] = 1;
		}
		this.setState({ position: newPosition, diceValues: [], tilesOwner, tilesMark, candidatePos: [] });
	}

	componentDidMount() {
		const { tilesOwner, tilesMark, mapSize: {x, y} } = this.state;

		for (let j=0; j<y; j++) {
			const ownerRow = [];
			const markRow = [];

			for (let i=0; i<x; i++) {
				ownerRow.push(0);
				markRow.push(false);
			}
			tilesOwner.push(ownerRow);
			tilesMark.push(markRow);
		}
		this.setState({ tilesOwner, tilesMark });
	}

	render() {
		const { diceValues, position, tilesOwner, tilesMark } = this.state;
		const {
			throwDices,
			handleClick
		} = this;

		console.log("현재 좌표:", position);
		console.log("후보 좌표:", this.state.candidatePos);
		// console.log("tilesMark:", tilesMark);

		return (
			<div className="container">
				<div>Game Main</div>
				{diceValues.length !== 0 ?
				<div>one:{diceValues[0]} two:{diceValues[1]}</div>
				:
				<div>주사위를 던져주세요</div>
				}
				<button
				onClick={throwDices}>
					주사위 던지기
				</button>
				<div className="mapContainer">
					<Map
					tilesOwner={tilesOwner}
					tilesMark={tilesMark}
					handleClick={handleClick} />
					<Marker owner={1} position={position} />
				</div>
			</div>
		)
	}
}

export default Game;