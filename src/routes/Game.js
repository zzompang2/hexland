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
		candidatePos: [],
		lineOwner: []
	}

	throwDices = () => {
		const { mapSize: {x: mapX, y: mapY}, position, positionsMark, candidatePos } = this.state;
		const maxX = mapX;
		const maxY = mapY;

		if(candidatePos.length !== 0) {
			console.log("이동할 좌표 선택해 주세요.");
			
			// 주사위 초기화 (for debug)
			candidatePos.map(pos => {  
				positionsMark[pos.y][pos.x] = false;
			});
			this.setState({ diceValues: [], positionsMark, candidatePos: [] });
			// =====================

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

	/**
	 * 
	 * @param {number} startX 
	 * @param {number} startY 
	 * @param {number} direction 1 ~ 4. 상우하좌
	 */
	fillTiles(startX, startY, direction) {
		console.log("타일 채우기:", startX, startY, direction);
		const { mapSize, lineOwner } = this.state;
		const lineOwnerCopy = [];
		const closedShapeLines = [];
		let x = startX;
		let y = startY;
		let dir = direction;

		lineOwner.map(row => {
			const rowCopy = [];
			row.map(owner => {rowCopy.push({...owner})});
			lineOwnerCopy.push(rowCopy);
		});

		closedShapeLines.push({x: startX, y: startY, dir: dir});

		for(let i = 0; i<100; i++) {
			if(dir === 1) {
				if(lineOwnerCopy[y-2][x].left === 1) {
					lineOwnerCopy[y-2][x].left = 0;
					y = y-1;
					dir = 1;
					closedShapeLines.push({x, y, dir});
				}
				else if(lineOwnerCopy[y-1][x].top === 1) {
					lineOwnerCopy[y-1][x].top = 0;
					y = y-1;
					dir = 2;
					closedShapeLines.push({x, y, dir});
				}
				else if(lineOwnerCopy[y-1][x-1].top === 1) {
					lineOwnerCopy[y-1][x-1].top = 0;
					y = y-1;
					dir = 4;
					closedShapeLines.push({x, y, dir});
				}
				else {
					console.log("back");
					closedShapeLines.pop();
					// 순환이 없는 경우
					if(closedShapeLines.length === 0) break;
					const last = closedShapeLines[closedShapeLines.length-1];
					x = last.x;
					y = last.y;
					dir = last.dir;
				}
			}
			else if(dir === 2) {
				if(lineOwnerCopy[y-1][x+1].left === 1) {
					lineOwnerCopy[y-1][x+1].left = 0;
					x = x+1;
					dir = 1;
					closedShapeLines.push({x, y, dir});
				}
				else if(lineOwnerCopy[y][x+1].top === 1) {
					lineOwnerCopy[y][x+1].top = 0;
					x = x+1;
					closedShapeLines.push({x, y, dir});
				}
				else if(lineOwnerCopy[y][x+1].left === 1) {
					lineOwnerCopy[y][x+1].left = 0;
					x = x+1;
					dir = 3;
					closedShapeLines.push({x, y, dir});
				}
				else {
					closedShapeLines.pop();
					// 순환이 없는 경우
					if(closedShapeLines.length === 0) break;
					const last = closedShapeLines[closedShapeLines.length-1];
					x = last.x;
					y = last.y;
					dir = last.dir;
				}
			}
			else if(dir === 3) {
				if(lineOwnerCopy[y+1][x].top === 1) {
					lineOwnerCopy[y+1][x].top = 0;
					y = y+1;
					dir = 2;
					closedShapeLines.push({x, y, dir});
				}
				else if(lineOwnerCopy[y+1][x].left === 1) {
					lineOwnerCopy[y+1][x].left = 0;
					y = y+1;
					dir = 3;
					closedShapeLines.push({x, y, dir});
				}
				else if(lineOwnerCopy[y+1][x-1].top === 1) {
					lineOwnerCopy[y+1][x-1].top = 0;
					y = y+1;
					dir = 4;
					closedShapeLines.push({x, y, dir});
				}
				else {
					closedShapeLines.pop();
					// 순환이 없는 경우
					if(closedShapeLines.length === 0) break;
					const last = closedShapeLines[closedShapeLines.length-1];
					x = last.x;
					y = last.y;
					dir = last.dir;
				}
			}
			else if(dir === 4) {
				if(lineOwnerCopy[y-1][x-1].left === 1) {
					lineOwnerCopy[y-1][x-1].left = 0;
					x = x-1;
					dir = 1;
					closedShapeLines.push({x, y, dir});
				}
				else if(lineOwnerCopy[y][x-1].left === 1) {
					lineOwnerCopy[y][x-1].left = 0;
					x = x-1;
					dir = 3;
					closedShapeLines.push({x, y, dir});
				}
				else if(lineOwnerCopy[y][x-2].top === 1) {
					lineOwnerCopy[y][x-2].top = 0;
					x = x-1;
					dir = 4;
					closedShapeLines.push({x, y, dir});
				}
				else {
					closedShapeLines.pop();

					// 순환이 없는 경우
					if(closedShapeLines.length === 0) break;

					const last = closedShapeLines[closedShapeLines.length-1];
					x = last.x;
					y = last.y;
					dir = last.dir;
				}
			}

			// 시작했던 line 으로 돌아온 경우, 순환이 있다는 뜻
			if(closedShapeLines.length !== 1 && x === startX && y === startY && dir === direction)
				break;
		}

		console.log("결과:", closedShapeLines);
	}

	handleClick = (e, x, y) => {
		const { mapSize, position, positionsOwner, positionsMark, candidatePos, lineOwner } = this.state;
		let newPosition;
		
		console.log("타일 클릭:", x, y);

		if(candidatePos.length === 0)
			return;

		// 후보들 중에 클릭한 좌표가 있는지 검사
		for(let i=0; i<candidatePos.length; i++) {
			const pos = candidatePos[i];
			if(pos.x === x && pos.y === y) {
				newPosition = pos;
				break;
			}
		}
		if(newPosition === undefined)
			return;

		// 후보 좌표 마크 제거
		candidatePos.map(pos => {  
			positionsMark[pos.y][pos.x] = false;
		});

		if(position.x !== newPosition.x) {
			const next = position.x < newPosition.x ? 1 : -1;
			for(let i=position.x; i !== newPosition.x; i=i+next) {
				if(next === 1) {
					if(lineOwner[position.y][i].top !== 1) {
						lineOwner[position.y][i] = {...lineOwner[position.y][i], top: 1};
						if((i < mapSize.x && (lineOwner[position.y][i+1].top === 1 || lineOwner[position.y][i+1].left === 1))
							||
							(position.y > 0 && lineOwner[position.y-1][i+1].left === 1))
							this.fillTiles(i, position.y, 2);
					}
				}
				else {
					if(lineOwner[position.y][i-1].top !== 1) {
						lineOwner[position.y][i-1] = {...lineOwner[position.y][i-1], top: 1};
						if((i-2 >= 0 && lineOwner[position.y][i-2].top === 1) ||
							 (i-1 >= 0 && lineOwner[position.y][i-1].left === 1) ||
							 (position.y > 0 && i > 0 && lineOwner[position.y-1][i-1].left === 1))
							this.fillTiles(i, position.y, 4);
					}
				}
			}
		}
		else {
			const next = position.y < newPosition.y ? 1 : -1;
			// for(let i=position.y; i !== newPosition.y; i=i+next) {
			// 	if(next === 1)
			// 		lineOwner[i][position.x] = {...lineOwner[i][position.x], left: 1};
			// 	else
			// 		lineOwner[i-1][position.x] = {...lineOwner[i-1][position.x], left: 1};
			// }
			for(let i=position.y; i !== newPosition.y; i=i+next) {
				if(next === 1) {
					if(lineOwner[i][position.x].left !== 1) {
						lineOwner[i][position.x] = {...lineOwner[i][position.x], left: 1};
						if(i < mapSize.y && 
							(lineOwner[i+1][position.x].top === 1 || 
							 lineOwner[i+1][position.x].left === 1 ||
							 (position.x > 0 && lineOwner[i+1][position.x-1].top === 1)))
							this.fillTiles(position.x, i, 3);
					}
				}
				else {
					if(lineOwner[i-1][position.x].left !== 1) {
						lineOwner[i-1][position.x] = {...lineOwner[i-1][position.x], left: 1};
						if((i > 0 && lineOwner[i-1][position.x].top === 1) ||
							 (i > 1 && lineOwner[i-2][position.x].left === 1) ||
							 (i > 0 && position.x > 0 && lineOwner[i-1][position.x-1].top === 1))
							this.fillTiles(position.x, i, 1);
					}
				}
			}
		}
		this.setState({ position: newPosition, diceValues: [], positionsOwner, positionsMark, candidatePos: [], lineOwner });
	}

	componentDidMount() {
		const { tilesOwner, positionsMark, positionsOwner, mapSize: {x, y}, lineOwner } = this.state;

		for (let j=0; j<=y; j++) {
			const tilesOwnerRow = [];
			const markRow = [];
			const positionsOwnerRow = [];
			const lineOwnerRow = [];

			for (let i=0; i<=x; i++) {
				tilesOwnerRow.push(0);
				markRow.push(false);
				positionsOwnerRow.push(0);
				lineOwnerRow.push({top: 0, left: 0});
			}
			// tilesOwnerRow.pop();

			tilesOwner.push(tilesOwnerRow);
			positionsOwner.push(positionsOwnerRow);
			positionsMark.push(markRow);
			lineOwner.push(lineOwnerRow);
		}
		// tilesOwner.pop();
		this.setState({ tilesOwner, positionsMark, positionsOwner, lineOwner });
	}

	render() {
		const { mapSize, diceValues, position, tilesOwner, positionsMark, positionsOwner, lineOwner } = this.state;
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
				<MapTile mapSize={mapSize} tilesOwner={tilesOwner} lineOwner={lineOwner} />
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