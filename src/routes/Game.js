import React from "react";
import MapTile from "../components/MapTile";
import MapPosition from "../components/MapPosition";
import Marker from "../components/Marker";
import "./Game.css";

const mapSize = {x: 10, y: 10};
const startPosition = {x: Math.floor((mapSize.x+1)/2), y: Math.floor((mapSize.y+1)/2)};

const teamName = "B";

class Game extends React.Component {
	state = {
		mapSize: mapSize,
		position: startPosition,
		diceValues: [],
		tilesOwner: [],
		positionsMark: [],
		candidatePos: [],
		lineOwner: []
	}

	/**
	 * 주사위를 던져 두 개의 랜덤한 숫자를 출력하고 이동할 수 있는 위치를 표시한다.
	 * 주사위 하나는 방향(UP = 1, RIGHT = 2, DOWN = 3, LEFT = 4),
	 * 나머지 하나는 거리로 한다.
	 */
	throwDices = () => {
		const { mapSize, position, positionsMark, candidatePos } = this.state;

		// 이미 주사위를 던진 경우
		if(candidatePos.length !== 0) {
			console.log("이동할 좌표 선택해 주세요.");
			
			// === 주사위 초기화 (for debug) ===
			// candidatePos.forEach(pos => positionsMark[pos.y][pos.x] = false);
			// this.setState({ diceValues: [], positionsMark, candidatePos: [] });
			// =============================

			return;
		}

		// 주사위 결과
		const diceValues = [
			Math.floor(Math.random() * 4) + 1, 
			Math.floor(Math.random() * 4) + 1];

		/**
		 * DIR 방향으로 DIS 거리 이동할 때 도착하는 곳의 좌표를
		 * 후보(candidatePos)에 추가하고 맵에 표시(positionsMark)한다.
		 */
		function addCandidatePos(dir, dis) {
			let candX, candY;		// 이동 가능한 좌표
			switch(dir) {
				case 1:
					candX = position.x;
					candY = Math.max(position.y - dis, 0);
					break;
				case 2:
					candX = Math.min(position.x + dis, mapSize.x);
					candY = position.y;
					break;
				case 3:
					candX = position.x;
					candY = Math.min(position.y + dis, mapSize.y);
					break;
				case 4:
					candX = Math.max(position.x - dis, 0);
					candY = position.y;
					break;
				default:
					return;
			}
			// 현재 위치와 다른 경우에만 후보에 추가
			if(position.x !== candX || position.y !== candY) {
				candidatePos.push({x: candX, y: candY});
				positionsMark[candY][candX] = true;
			}
		};
		
		addCandidatePos(diceValues[0], diceValues[1]);
		if(diceValues[0] !== diceValues[1])
			addCandidatePos(diceValues[1], diceValues[0]);

		if(candidatePos.length === 0)
			return;

		this.setState({ diceValues, positionsMark, candidatePos });
	}

	/**
	 * 파라미터로 들어온 선을 포함하는 닫힌 경로를 찾는다. 
	 * 그리고 그 경로 내부의 TILE 들의 OWNER 로 설정한다.
	 * @param {number} startX 선의 시작점 X 좌표
	 * @param {number} startY 선의 시작점 Y 좌표
	 * @param {number} direction 시작점에서 부터 방향 (1~4:상우하좌)
	 */
	fillTiles(startX, startY, direction) {
		console.log("타일 채우기:", startX, startY, direction);
		const { mapSize, lineOwner } = this.state;
		const lineOwnerCopy = [];				// for finding closed shape
		const lineOwnerCopy2 = [];			// for finding tiles to fill
		const closedShapeLines = [];		// 닫힌 경로를 구성하는 line
		let preX = startX;
		let preY = startY;
		let dir = direction;
		const shouldFillTiles = [];			// 칠해야 하는 타일

		// deep copy
		lineOwner.forEach(row => {
			const rowCopy = [];
			const rowCopy2 = [];
			row.forEach(owner => {
				rowCopy.push({...owner});
				rowCopy2.push({...owner});
			});
			lineOwnerCopy.push(rowCopy);
			lineOwnerCopy2.push(rowCopy2);
		});

		/**
		 * (curX, curY) 를 꼭짓점으로 하는 선이 있는지 확인하고
		 * 있으면 preX, preY, dir 를 업데이트하고 closed shape 를 구성하는 선에 넣는다.
		 * 연결되어 있는 선이 하나도 없다면 closed shape 를 구성하지 않는 선이므로 제외.
		 */
		function check(curX, curY, up, right, down, left) {
			if(up && curY > 0 && lineOwnerCopy[curY-1][curX].left === teamName) {
				lineOwnerCopy[curY-1][curX].left = 0;
				preX = curX;
				preY = curY;
				dir = 1;
				closedShapeLines.push({x: curX, y: curY, dir});
			}
			else if(right && lineOwnerCopy[curY][curX].top === teamName) {
				lineOwnerCopy[curY][curX].top = 0;
				preX = curX;
				preY = curY;
				dir = 2;
				closedShapeLines.push({x: curX, y: curY, dir});
			}
			else if(down && lineOwnerCopy[curY][curX].left === teamName) {
				lineOwnerCopy[curY][curX].left = 0;
				preX = curX;
				preY = curY;
				dir = 3;
				closedShapeLines.push({x: curX, y: curY, dir});
			}
			else if(left && curX > 0 && lineOwnerCopy[curY][curX-1].top === teamName) {
				lineOwnerCopy[curY][curX-1].top = 0;
				preX = curX;
				preY = curY;
				dir = 4;
				closedShapeLines.push({x: curX, y: curY, dir});
			}
			else {
				closedShapeLines.pop();
				// 순환이 없는 경우
				if(closedShapeLines.length === 0)
					return false;
				const last = closedShapeLines[closedShapeLines.length-1];
				preX = last.x;
				preY = last.y;
				dir = last.dir;
			}
			return true;
		}

		closedShapeLines.push({x: preX, y: preY, dir});

		while(true) {
			console.log(preX, preY, dir);
			// UP 방향의 선인 경우: 위, 오른쪽, 왼쪽과 연결되어 있는지 확인
			if(dir === 1) {
				if(!check(preX, preY-1, true, true, false, true))
					break;
			}
			// RIGHT 방향의 선인 경우: 위, 오른쪽, 아래와 연결되어 있는지 확인
			else if(dir === 2) {
				if(!check(preX+1, preY, true, true, true, false))
					break;
			}
			// DOWN 방향의 선인 경우: 오른쪽, 아래, 왼쪽과 연결되어 있는지 확인
			else if(dir === 3) {
				if(!check(preX, preY+1, false, true, true, true))
					break;
			}
			// LEFT 방향의 선인 경우: 위, 아래, 왼쪽과 연결되어 있는지 확인
			else if(dir === 4) {
				if(!check(preX-1, preY, true, false, true, true))
					break;
			}

			// 시작했던 line 으로 돌아온 경우, 순환이 있다는 뜻
			if(closedShapeLines.length !== 1 && preX === startX && preY === startY && dir === direction)
				break;
		}

		console.log(closedShapeLines);

		if(closedShapeLines.length === 0)
			return [];

		// 확실히 칠해지는 한 타일을 찾기 위해, 가장 왼쪽에 있는 타일을 찾는다.
		let mostLeftTile = {...mapSize};
		for(let i=0; i<closedShapeLines.length; i++)
			if(mostLeftTile.x > closedShapeLines[i].x) {
				if(closedShapeLines[i].dir === 1)
					mostLeftTile = {...closedShapeLines[i], y: closedShapeLines[i].y-1};
				else if(closedShapeLines[i].dir === 3)
					mostLeftTile = {...closedShapeLines[i]};
			}

		shouldFillTiles.push( mostLeftTile );

		// mostLeftTile 을 시작으로 인접한 타일을 칠하고 배열에 추가
		for(let i=0; i<shouldFillTiles.length; i++) {
			const tile = shouldFillTiles[i];
			console.log("타일:", tile);
			if(lineOwnerCopy2[tile.y][tile.x].top !== teamName) {
				lineOwnerCopy2[tile.y][tile.x].top = teamName;
				shouldFillTiles.push({x: tile.x, y: tile.y-1});
			}
			if(lineOwnerCopy2[tile.y][tile.x].left !== teamName) {
				lineOwnerCopy2[tile.y][tile.x].left = teamName;
				shouldFillTiles.push({x: tile.x-1, y: tile.y});
			}
			if(lineOwnerCopy2[tile.y][tile.x+1].left !== teamName) {
				lineOwnerCopy2[tile.y][tile.x+1].left = teamName;
				shouldFillTiles.push({x: tile.x+1, y: tile.y});
			}
			if(lineOwnerCopy2[tile.y+1][tile.x].top !== teamName) {
				lineOwnerCopy2[tile.y+1][tile.x].top = teamName;
				shouldFillTiles.push({x: tile.x, y: tile.y+1});
			}
		};

		console.log("결과 타일:", shouldFillTiles);
		return shouldFillTiles;
	}

	handleClick = (e, x, y) => {
		const { mapSize, position, tilesOwner, positionsMark, candidatePos, lineOwner } = this.state;
		let newPosition;
		const shouldFillTiles = [];
		
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
					if(lineOwner[position.y][i].top !== teamName) {
						lineOwner[position.y][i] = {...lineOwner[position.y][i], top: teamName};
						if((i < mapSize.x && (lineOwner[position.y][i+1].top === teamName || lineOwner[position.y][i+1].left === teamName))
							||
							(position.y > 0 && lineOwner[position.y-1][i+1].left === teamName))
							shouldFillTiles.push(...this.fillTiles(i, position.y, 2));
					}
				}
				else {
					if(lineOwner[position.y][i-1].top !== teamName) {
						lineOwner[position.y][i-1] = {...lineOwner[position.y][i-1], top: teamName};
						if((i-2 >= 0 && lineOwner[position.y][i-2].top === teamName) ||
							 (i-1 >= 0 && lineOwner[position.y][i-1].left === teamName) ||
							 (position.y > 0 && i > 0 && lineOwner[position.y-1][i-1].left === teamName))
							 shouldFillTiles.push(...this.fillTiles(i, position.y, 4));
					}
				}
			}
		}
		else {
			const next = position.y < newPosition.y ? 1 : -1;
			for(let i=position.y; i !== newPosition.y; i=i+next) {
				if(next === 1) {
					if(lineOwner[i][position.x].left !== teamName) {
						lineOwner[i][position.x] = {...lineOwner[i][position.x], left: teamName};
						if(i < mapSize.y && 
							(lineOwner[i+1][position.x].top === teamName || 
							 lineOwner[i+1][position.x].left === teamName ||
							 (position.x > 0 && lineOwner[i+1][position.x-1].top === teamName)))
							 shouldFillTiles.push(...this.fillTiles(position.x, i, 3));
					}
				}
				else {
					if(lineOwner[i-1][position.x].left !== teamName) {
						lineOwner[i-1][position.x] = {...lineOwner[i-1][position.x], left: teamName};
						if((i > 0 && lineOwner[i-1][position.x].top === teamName) ||
							 (i > 1 && lineOwner[i-2][position.x].left === teamName) ||
							 (i > 0 && position.x > 0 && lineOwner[i-1][position.x-1].top === teamName))
							 shouldFillTiles.push(...this.fillTiles(position.x, i, 1));
					}
				}
			}
		}
		console.log("칠해야 하는 타일:", shouldFillTiles);
		shouldFillTiles.forEach(tile => tilesOwner[tile.y][tile.x] = teamName);
		this.setState({ position: newPosition, diceValues: [], tilesOwner, positionsMark, candidatePos: [], lineOwner });
	}

	componentDidMount() {
		const { tilesOwner, positionsMark, mapSize: {x, y}, lineOwner } = this.state;

		for (let j=0; j<=y; j++) {
			const tilesOwnerRow = [];
			const markRow = [];
			const lineOwnerRow = [];

			for (let i=0; i<=x; i++) {
				tilesOwnerRow.push("no");
				markRow.push(false);
				lineOwnerRow.push({top: "no", left: "no"});
			}
			tilesOwner.push(tilesOwnerRow);
			positionsMark.push(markRow);
			lineOwner.push(lineOwnerRow);
		}
		this.setState({ tilesOwner, positionsMark, lineOwner });
	}

	render() {
		const { mapSize, diceValues, position, tilesOwner, positionsMark, lineOwner } = this.state;
		const {
			throwDices,
			handleClick
		} = this;

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
					positionsMark={positionsMark}
					handleClick={handleClick} />
					<Marker owner={teamName} position={position} />
				</div>
			</div>
		)
	}
}

export default Game;