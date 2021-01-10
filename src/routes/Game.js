import React from "react";
import MapTile from "../components/MapTile";
import MapPosition from "../components/MapPosition";
import Marker from "../components/Marker";
import "./Game.css";

const mapSize = {x: 20, y: 20};
const startPosition = {x: Math.floor((mapSize.x+1)/2), y: Math.floor((mapSize.y+1)/2)};

class Game extends React.Component {
	state = {
		mapSize: mapSize,
		position: startPosition,
		diceValues: [],
		tilesOwner: [],
		positionsOwner: [],
		positionsMark: [],
		candidatePos: []
	}

	throwDices = () => {
		console.log("주사위 던짐!");
		const { mapSize: {x: mapX, y: mapY}, position, positionsMark, candidatePos } = this.state;
		const maxX = mapX;
		const maxY = mapY;

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
				x = position.x + two > maxX ? maxX : position.x + two;
				y = position.y;
				break;
			case 3:
				x = position.x;
				y = position.y + two > maxY ? maxY : position.y + two;
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
			positionsMark[y][x] = true;
		}

		if(one !== two) {
			switch(two) {
				case 1:
					x = position.x;
					y = position.y - one < 0 ? 0 : position.y - one;
					break;
				case 2:
					x = position.x + one > maxX ? maxX : position.x + one;
					y = position.y;
					break;
				case 3:
					x = position.x;
					y = position.y + one > maxY ? maxY : position.y + one;
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
				positionsMark[y][x] = true;
			}
		}

		if(candidatePos.length === 0)
			return;

		this.setState({ diceValues: [one, two], positionsMark, candidatePos });
	}

	handleClick = (e, x, y) => {
		const { position, positionsOwner, positionsMark, candidatePos } = this.state;
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
		candidatePos.map(pos => { 
			positionsMark[pos.y][pos.x] = false;
		 })

		if(position.x !== newPosition.x) {
			const min = Math.min(position.x, newPosition.x);
			const max = Math.max(position.x, newPosition.x);
			for(let i=min; i<=max; i++)
				positionsOwner[position.y][i] = 1;
		}
		else {
			const min = Math.min(position.y, newPosition.y);
			const max = Math.max(position.y, newPosition.y);
			for(let i=min; i<=max; i++)
				positionsOwner[i][position.x] = 1;
		}
		this.setState({ position: newPosition, diceValues: [], positionsOwner, positionsMark, candidatePos: [] });
	}

	componentDidMount() {
		const { tilesOwner, positionsMark, positionsOwner, mapSize: {x, y} } = this.state;

		for (let j=0; j<y+1; j++) {
			const tilesOwnerRow = [];
			const markRow = [];
			const positionsOwnerRow = [];

			for (let i=0; i<x+1; i++) {
				tilesOwnerRow.push(0);
				markRow.push(false);
				positionsOwnerRow.push(0);
			}
			tilesOwnerRow.pop();

			tilesOwner.push(tilesOwnerRow);
			positionsOwner.push(positionsOwnerRow);
			positionsMark.push(markRow);
		}
		tilesOwner.pop();
		this.setState({ tilesOwner, positionsMark, positionsOwner });
	}

	render() {
		const { diceValues, position, tilesOwner, positionsMark, positionsOwner } = this.state;
		const {
			throwDices,
			handleClick
		} = this;

		console.log("현재 좌표:", position);
		console.log("후보 좌표:", this.state.candidatePos);

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
				<MapTile tilesOwner={tilesOwner} />
				<MapPosition
					positionsOwner={positionsOwner}
					positionsMark={positionsMark}
					handleClick={handleClick} />
					<Marker owner={1} position={position} />
				</div>
			</div>
		)
	}
}

export default Game;