import React from "react";
import MapTile from "../components/MapTile";
import MapPosition from "../components/MapPosition";
import Marker from "../components/Marker";
import "./Game.css";

const mapSize = {x: 10, y: 10};
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

	fillTiles(startX, startY) {
		console.log("타일 채우기:", startX, startY);
		const { mapSize, positionsOwner } = this.state;
		const positionsOwnerCopy = [];
		const closedShapePos = [];
		let x = startX;
		let y = startY;

		positionsOwner.map((row, i) => {
			positionsOwnerCopy[i] = [...row];
		});

		closedShapePos.push({x: startX, y: startY});
		positionsOwnerCopy[y][x] = 0;

		while(true) {
			if(y-1 >= 0 && positionsOwnerCopy[y-1][x] === 1) {
				console.log("case 1");
				y = y-1;
				closedShapePos.push({x, y});
			}
			else if(x+1 <= mapSize.x && positionsOwnerCopy[y][x+1] === 1) {
				console.log("case 2");
				x = x+1;
				closedShapePos.push({x, y});
			}
			else if(y+1 <= mapSize.y && positionsOwnerCopy[y+1][x] === 1) {
				console.log("case 3");
				y = y+1;
				closedShapePos.push({x, y});
			}
			else if(x-1 >= 0 && positionsOwnerCopy[y][x-1] === 1) {
				console.log("case 4");
				x = x-1;
				closedShapePos.push({x, y});
			}
			else {
				console.log("case 5");

				if((x === startX && Math.abs(y-startY) === 1) ||
					 (y === startY && Math.abs(x-startX) === 1))
					break;

				closedShapePos.pop();
				const last = closedShapePos[closedShapePos.length-1];
				x = last.x;
				y = last.y;
			}
			positionsOwnerCopy[y][x] = 0;
		}
		console.log("결과:", closedShapePos);
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
			const next = position.x < newPosition.x ? 1 : -1;
			for(let i=position.x; ; i=i+next) {
				if(positionsOwner[position.y][i] !== 1) {
					positionsOwner[position.y][i] = 1;

					if(positionsOwner[position.y][i+next] === 1 ||
						 (positionsOwner[position.y+1] !== undefined &&
							positionsOwner[position.y+1][i] === 1) ||
						 (position.y-1 >= 0 && 
							positionsOwner[position.y-1][i] === 1))
						this.fillTiles(i, position.y);
				}

				if(i === newPosition.x)
					break;
			}
		}
		else {
			const next = position.y < newPosition.y ? 1 : -1;
			for(let i=position.y; ; i=i+next) {
				if(positionsOwner[i][position.x] !== 1) {
					positionsOwner[i][position.x] = 1;

					if((positionsOwner[i+next] !== undefined &&
						  positionsOwner[i+next][position.x] === 1) ||
						 positionsOwner[i][position.x+1] === 1 ||
						 positionsOwner[i][position.x-1] === 1)
						this.fillTiles(position.x, i);
				}

				if(i === newPosition.y)
					break;
			}
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

		// console.log("현재 좌표:", position);
		// console.log("후보 좌표:", this.state.candidatePos);

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