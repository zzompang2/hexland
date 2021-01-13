import React from "react";
import MapBackground from "../components/MapBackground";
import MapTile from "../components/MapTile";
import MapPosition from "../components/MapPosition";
import Dice from "../components/Dice";
import Navigation from "../components/Navigation";
import "./Game.css";
import cat from "../images/bg_cat.png";
import dog from "../images/bg_dog.png";
import icon_cat from "../images/icon_cat.png";
import icon_dog from "../images/icon_dog.png";


const noOwner = 0;
const block = 1;
const teamNum = 2;

class Game extends React.Component {
	state = {
		isMount: false,
		firstTeamIdx: undefined,
		tileSize: undefined,
		mapSize: undefined,
		nowTurn: 0,
		markerPositions: [],
		scores: [0, 0],
		diceValues: [],
		tilesOwner: [],
		positionsMark: [],
		candidatePos: [],
		lineOwner: []
	}
	gameFocusRef = null;

	/**
	 * 주사위를 던져 두 개의 랜덤한 숫자를 출력하고 이동할 수 있는 위치를 표시한다.
	 * 주사위 하나는 방향(UP = 1, RIGHT = 2, DOWN = 3, LEFT = 4),
	 * 나머지 하나는 거리로 한다.
	 */
	throwDices = () => {
		const { firstTeamIdx, mapSize, nowTurn, markerPositions, positionsMark, candidatePos } = this.state;
		let nextTurn = nowTurn;

		// 이미 주사위를 던진 경우
		if(candidatePos.length !== 0) {
			console.log("이동할 좌표 선택해 주세요.");
			
			// === 주사위 초기화 (for debug) ===
			candidatePos.forEach(pos => positionsMark[pos.y][pos.x] = false);
			this.setState({ diceValues: [], positionsMark, candidatePos: [] });
			// =============================

			return;
		}

		// 주사위 결과
		const diceValues = [
			Math.floor(Math.random() * 4) + 1, 
			Math.floor(Math.random() * 4) + 1
		];

		/**
		 * DIR 방향으로 DIS 거리 이동할 때 도착하는 곳의 좌표를
		 * 후보(candidatePos)에 추가하고 맵에 표시(positionsMark)한다.
		 */
		function addCandidatePos(dir, dis) {
			let candX, candY;		// 이동 가능한 좌표
			const markerPosition = markerPositions[nowTurn - firstTeamIdx];
			switch(dir) {
				case 1:
				case 3:
					candX = markerPosition.x;
					candY = Math.max(markerPosition.y - dis, 0);
					checkSameAsCurrent(candX, candY);
					candX = markerPosition.x;
					candY = Math.min(markerPosition.y + dis, mapSize.y);
					checkSameAsCurrent(candX, candY);
					break;
				case 2:
				case 4:
					candX = Math.min(markerPosition.x + dis, mapSize.x);
					candY = markerPosition.y;
					checkSameAsCurrent(candX, candY);
					candX = Math.max(markerPosition.x - dis, 0);
					candY = markerPosition.y;
					checkSameAsCurrent(candX, candY);
					break;
				default:
					return;
			}
			function checkSameAsCurrent(x, y) {
				// 현재 위치와 다른 경우에만 후보에 추가
				if(markerPosition.x !== x || markerPosition.y !== y) {
					candidatePos.push({x, y});
					positionsMark[y][x] = true;
				}
			}
		};
		
		addCandidatePos(diceValues[0], diceValues[1]);
		if(diceValues[0] !== diceValues[1])
			addCandidatePos(diceValues[1], diceValues[0]);

		if(candidatePos.length === 0) {
			nextTurn = nowTurn + 1 < firstTeamIdx + teamNum ? nowTurn + 1 : firstTeamIdx;
			diceValues.length = 0;
		}

		this.setState({ nowTurn: nextTurn, diceValues, positionsMark, candidatePos });
	}

	/**
	 * 파라미터로 들어온 선을 포함하는 닫힌 경로를 찾는다. 
	 * 그리고 그 경로 내부의 TILE 들의 OWNER 로 설정한다.
	 * @param {number} startX 선의 시작점 X 좌표
	 * @param {number} startY 선의 시작점 Y 좌표
	 * @param {number} direction 시작점에서 부터 방향 (1~4:상우하좌)
	 */
	fillTiles(startX, startY, direction, lineOwner) {
		console.log("타일 채우기:", startX, startY, direction);
		const { mapSize, tilesOwner, nowTurn } = this.state;
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
			// 시작했던 line 으로 돌아온 경우, 순환이 있다는 뜻
			if(curX === startX && curY === startY)
				return false;

			if(up && curY > 0 && lineOwnerCopy[curY-1][curX].left === nowTurn) {
				lineOwnerCopy[curY-1][curX].left = noOwner;
				preX = curX;
				preY = curY;
				dir = 1;
				closedShapeLines.push({x: curX, y: curY, dir});
			}
			else if(right && lineOwnerCopy[curY][curX].top === nowTurn) {
				lineOwnerCopy[curY][curX].top = noOwner;
				preX = curX;
				preY = curY;
				dir = 2;
				closedShapeLines.push({x: curX, y: curY, dir});
			}
			else if(down && lineOwnerCopy[curY][curX].left === nowTurn) {
				lineOwnerCopy[curY][curX].left = noOwner;
				preX = curX;
				preY = curY;
				dir = 3;
				closedShapeLines.push({x: curX, y: curY, dir});
			}
			else if(left && curX > 0 && lineOwnerCopy[curY][curX-1].top === nowTurn) {
				lineOwnerCopy[curY][curX-1].top = noOwner;
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
		if(dir === 1)
			lineOwnerCopy[preY-1][preX].left = noOwner;
		else if(dir === 2)
			lineOwnerCopy[preY][preX].top = noOwner;
		else if(dir === 3)
			lineOwnerCopy[preY][preX].left = noOwner;
		else if(dir === 4)
			lineOwnerCopy[preY][preX-1].top = noOwner;

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
		}

		if(closedShapeLines.length === 0)
			return [];

		// 확실히 칠해지는 한 타일을 찾기 위해, 가장 왼쪽에 있는 타일을 찾는다.
		let mostLeftTile = {...mapSize};
		for(let i=0; i<closedShapeLines.length; i++) {
			const {x, y, dir} = closedShapeLines[i];
			if(mostLeftTile.x > x) {
				if(dir === 1 && tilesOwner[y-1][x] !== nowTurn)
					mostLeftTile = {x, y: y-1};
				else if(dir === 3 && tilesOwner[y][x] !== nowTurn)
					mostLeftTile = {x, y};
			}
		}
		shouldFillTiles.push( mostLeftTile );

		// mostLeftTile 을 시작으로 인접한 타일을 칠하고 배열에 추가
		for(let i=0; i<shouldFillTiles.length; i++) {
			const tile = shouldFillTiles[i];
			console.log("타일:", tile);
			if(lineOwnerCopy2[tile.y][tile.x].top !== nowTurn) {
				lineOwnerCopy2[tile.y][tile.x].top = nowTurn;
				shouldFillTiles.push({x: tile.x, y: tile.y-1});
			}
			if(lineOwnerCopy2[tile.y][tile.x].left !== nowTurn) {
				lineOwnerCopy2[tile.y][tile.x].left = nowTurn;
				shouldFillTiles.push({x: tile.x-1, y: tile.y});
			}
			if(lineOwnerCopy2[tile.y][tile.x+1].left !== nowTurn) {
				lineOwnerCopy2[tile.y][tile.x+1].left = nowTurn;
				shouldFillTiles.push({x: tile.x+1, y: tile.y});
			}
			if(lineOwnerCopy2[tile.y+1][tile.x].top !== nowTurn) {
				lineOwnerCopy2[tile.y+1][tile.x].top = nowTurn;
				shouldFillTiles.push({x: tile.x, y: tile.y+1});
			}
			// 칠한 타일의 내부선/외곽선 block 하기
			lineOwner[tile.y][tile.x].top = block;
			lineOwner[tile.y][tile.x].left = block;
			lineOwner[tile.y][tile.x+1].left = block;
			lineOwner[tile.y+1][tile.x].top = block;
		};

		// 외곽선은 다시 block 풀기
		// closedShapeLines.forEach(line => {
		// 	const {x, y, dir} = line;
		// 	if(dir === 1 && !(tilesOwner[y-1][x] === nowTurn && x > 0 && tilesOwner[y-1][x-1] === nowTurn))
		// 		lineOwner[y-1][x].left = nowTurn;
		// 	else if(dir === 2 && !(tilesOwner[y][x] === nowTurn && y > 0 && tilesOwner[y-1][x] === nowTurn))
		// 		lineOwner[y][x].top = nowTurn;
		// 	else if(dir === 3 && !(tilesOwner[y][x] === nowTurn && x > 0 && tilesOwner[y][x-1] === nowTurn))
		// 		lineOwner[y][x].left = nowTurn;
		// 	else if(dir === 4 && !(tilesOwner[y][x-1] === nowTurn && y > 0 && tilesOwner[y-1][x-1] === nowTurn))
		// 		lineOwner[y][x-1].top = nowTurn;
		// });

		console.log("결과 타일:", shouldFillTiles);
		return shouldFillTiles;
	}

	handleClick = (x, y) => {
		const { candidatePos } = this.state;
		let newPosition;
		
		console.log("타일 클릭:", x, y);

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

		this.markMoveTo(x, y);
	}

	markMoveTo = (newX, newY) => {
		const { firstTeamIdx, mapSize, nowTurn, markerPositions, tilesOwner, positionsMark, candidatePos, lineOwner, scores } = this.state;
		const markerPosition = markerPositions[nowTurn - firstTeamIdx];
		const shouldFillTiles = [];
		const lineOwnerCopy = [];

		// 후보 좌표 마크 제거
		candidatePos.forEach(pos => positionsMark[pos.y][pos.x] = false);

		// deep copy
		lineOwner.forEach(row => {
			const rowCopy = [];
			row.forEach(owner => rowCopy.push({...owner}));
			lineOwnerCopy.push(rowCopy);
		});

		// x 축 방향으로 선을 그을 때
		if(markerPosition.x !== newX) {
			const next = markerPosition.x < newX ? 1 : -1;
			for(let i=markerPosition.x; i !== newX; i=i+next) {
				if(next === 1) {
					if(lineOwnerCopy[markerPosition.y][i].top !== nowTurn &&
						 lineOwnerCopy[markerPosition.y][i].top !== block) {
						lineOwnerCopy[markerPosition.y][i] = {...lineOwnerCopy[markerPosition.y][i], top: nowTurn};
						if((i < mapSize.x && (lineOwnerCopy[markerPosition.y][i+1].top === nowTurn || lineOwnerCopy[markerPosition.y][i+1].left === nowTurn))
							||
							(markerPosition.y > 0 && lineOwnerCopy[markerPosition.y-1][i+1].left === nowTurn))
							shouldFillTiles.push(...this.fillTiles(i, markerPosition.y, 2, lineOwnerCopy));
					}
				}
				else {
					if(lineOwnerCopy[markerPosition.y][i-1].top !== nowTurn &&
						 lineOwnerCopy[markerPosition.y][i-1].top !== block) {
						lineOwnerCopy[markerPosition.y][i-1] = {...lineOwnerCopy[markerPosition.y][i-1], top: nowTurn};
						if((i-2 >= 0 && lineOwnerCopy[markerPosition.y][i-2].top === nowTurn) ||
							 (i-1 >= 0 && lineOwnerCopy[markerPosition.y][i-1].left === nowTurn) ||
							 (markerPosition.y > 0 && i > 0 && lineOwnerCopy[markerPosition.y-1][i-1].left === nowTurn))
							 shouldFillTiles.push(...this.fillTiles(i, markerPosition.y, 4, lineOwnerCopy));
					}
				}
			}
		}
		// y 축 방향으로 선을 그을 때
		else {
			const next = markerPosition.y < newY ? 1 : -1;
			for(let i=markerPosition.y; i !== newY; i=i+next) {
				if(next === 1) {
					if(lineOwnerCopy[i][markerPosition.x].left !== nowTurn &&
						 lineOwnerCopy[i][markerPosition.x].left !== block) {
						lineOwnerCopy[i][markerPosition.x] = {...lineOwnerCopy[i][markerPosition.x], left: nowTurn};
						if(i < mapSize.y && 
							(lineOwnerCopy[i+1][markerPosition.x].top === nowTurn || 
							 lineOwnerCopy[i+1][markerPosition.x].left === nowTurn ||
							 (markerPosition.x > 0 && lineOwnerCopy[i+1][markerPosition.x-1].top === nowTurn)))
							 shouldFillTiles.push(...this.fillTiles(markerPosition.x, i, 3, lineOwnerCopy));
					}
				}
				else {
					if(lineOwnerCopy[i-1][markerPosition.x].left !== nowTurn &&
						 lineOwnerCopy[i-1][markerPosition.x].left !== block) {
						lineOwnerCopy[i-1][markerPosition.x] = {...lineOwnerCopy[i-1][markerPosition.x], left: nowTurn};
						if((i > 0 && lineOwnerCopy[i-1][markerPosition.x].top === nowTurn) ||
							 (i > 1 && lineOwnerCopy[i-2][markerPosition.x].left === nowTurn) ||
							 (i > 0 && markerPosition.x > 0 && lineOwnerCopy[i-1][markerPosition.x-1].top === nowTurn))
							 shouldFillTiles.push(...this.fillTiles(markerPosition.x, i, 1, lineOwnerCopy));
					}
				}
			}
		}
		console.log("칠해야 하는 타일:", shouldFillTiles);

		const nextTurn = nowTurn + 1 < firstTeamIdx + teamNum ? nowTurn + 1 : firstTeamIdx;
		let addScore = 0;
		let minusScore = 0;

		markerPositions[nowTurn - firstTeamIdx] = {x: newX, y: newY};
		shouldFillTiles.forEach(tile => {
			if(tilesOwner[tile.y][tile.x] !== nowTurn) {
				addScore++;
				if(tilesOwner[tile.y][tile.x] === nextTurn)
					minusScore++;
				tilesOwner[tile.y][tile.x] = nowTurn;
			}
		});

		const newScores = [...scores];
		newScores[nowTurn-firstTeamIdx] += addScore;
		newScores[nextTurn-firstTeamIdx] -= minusScore;

		this.setState({ 
			nowTurn: nextTurn, 
			markerPositions: markerPositions, 
			diceValues: [], 
			tilesOwner, positionsMark, 
			candidatePos: [], 
			lineOwner: lineOwnerCopy, 
			scores: newScores 
		});
	}

	handleKeyDown = (keyCode) => {
		const { firstTeamIdx, nowTurn, markerPositions, candidatePos } = this.state;
		const position = markerPositions[nowTurn - firstTeamIdx];
		const { throwDices, markMoveTo } = this;

		if(keyCode === 32)
			throwDices();

		if(candidatePos.length === 0)
			return;

		switch(keyCode) {
			case 37:	// 왼쪽
				let minPosX = position.x;
				candidatePos.forEach(pos => {
					if(pos.x < minPosX && pos.y === position.y)
						minPosX = pos.x;
				});
				if(minPosX !== position.x)
					markMoveTo(minPosX, position.y);
				break;

			case 38:	// 위
				let minPosY = position.y;
				candidatePos.forEach(pos => {
					if(pos.x === position.x && pos.y < minPosY)
						minPosY = pos.y;	
				});
				if(minPosY !== position.y)
					markMoveTo(position.x, minPosY);
				break;

			case 39:	// 오른쪽
				let maxPosX = position.x;
				candidatePos.forEach(pos => {
					if(pos.x > maxPosX && pos.y === position.y)
						maxPosX = pos.x;
				});
				markMoveTo(maxPosX, position.y);
				break;

			case 40:	// 아래
			let maxPosY = position.y;
				candidatePos.forEach(pos => {
					if(pos.x === position.x && pos.y > maxPosY)
						maxPosY = pos.y;
				});
				markMoveTo(position.x, maxPosY);
				break;

			default:
				break;
		}
	}

	gameFocus = () => {
		this.gameFocusRef.focus();
	}

	componentDidUpdate() {
		this.gameFocus();
	}

	componentDidMount() {
		const { markerPositions, tilesOwner, positionsMark, lineOwner } = this.state;
		const { location: { state }, history } = this.props;

		// /game 에서 새로고침 되어서 state 를 받지 못한 경우, 홈으로 돌아가기
		if(state === undefined) {
			history.push("/");
			return;
		}
		
		const { firstTeamIdx, mapLength, mapSize, nowTurn } = state;

		const startY = Math.floor(mapSize.y/2);
		if (mapSize.x % 2 === 0) {
			markerPositions.push({x: mapSize.x/2-1, y: startY});
			markerPositions.push({x: mapSize.x/2+1, y: startY});
		}
		else {
			const startX = Math.floor(mapSize.x/2);
			markerPositions.push({x: startX, y: startY});
			markerPositions.push({x: startX+1, y: startY});
		}

		for (let j=0; j<=mapSize.y; j++) {
			const tilesOwnerRow = [];
			const markRow = [];
			const lineOwnerRow = [];

			for (let i=0; i<=mapSize.x; i++) {
				tilesOwnerRow.push(noOwner);
				markRow.push(false);
				lineOwnerRow.push({top: noOwner, left: noOwner});
			}
			tilesOwner.push(tilesOwnerRow);
			positionsMark.push(markRow);
			lineOwner.push(lineOwnerRow);
		}

		// tile 사이즈 계산
		const width = mapLength.width / mapSize.x;
		const height = mapLength.height / mapSize.y;

		this.setState({ isMount: true, firstTeamIdx, nowTurn, tileSize: {width, height}, mapSize, markerPositions, tilesOwner, positionsMark, lineOwner });
	}

	render() {
		const { isMount, firstTeamIdx, tileSize, mapSize, markerPositions, diceValues, tilesOwner, positionsMark, lineOwner, nowTurn, scores } = this.state;
		const {
			gameFocus,
			throwDices,
			handleClick,
			handleKeyDown
		} = this;

		if(!isMount)
			return null;

		return (
			<div className="container__game" onClick={gameFocus}>

				{/* 고양이 */}
				<div className="container__bgImage">
					<div className={nowTurn === firstTeamIdx ? "score__highlight" : "score__bg"}>
						<div>{scores[0]}</div>
					</div>
					<img className="image__cat" src={cat} alt="고양이" />
					<div className="logo__blueBox" />
				</div>

				<div className="container__column">
					
					<Navigation />

					{/* 키보드 조작을 위한 input */}
					<input
						className="gameFocusInput"
						ref={ref => (this.gameFocusRef = ref)}
						onKeyDown={e => handleKeyDown(e.keyCode)} />

					<div className="container__top">
						{/* 주사위 결과창 */}
						<div className="container__dice">
							<Dice value={diceValues[0] === undefined ? "" : diceValues[0]} />
							<Dice value={diceValues[1] === undefined ? "" : diceValues[1]} />
						</div>
					</div>

					<div className="container__map">
						<MapBackground tileSize={tileSize} mapSize={mapSize} tilesOwner={tilesOwner} />
						<MapTile tileSize={tileSize} mapSize={mapSize} tilesOwner={tilesOwner} lineOwner={lineOwner} />
						<MapPosition
						tileSize={tileSize}
						positionsMark={positionsMark}
						handleClick={handleClick}
						markerPositions={markerPositions}
						firstTeamIdx={firstTeamIdx}
						nowTurn={nowTurn} />
					</div>

					{/* 키보드 사용 설명서 */}
					<div className="container__button">
						<div className="container__spacebar">
							<button className="button__spacebar" onClick={throwDices}>
								SPACE BAR
							</button>
							<p>주사위 굴리기</p>
						</div>
						<div className="container__arrow">
							<div className="container__arrowKey">
								<button className="button__arrow" onClick={()=>handleKeyDown(38)}>
									^
								</button>
								<div>
									<button className="button__arrow" onClick={()=>handleKeyDown(37)}>
										{"<"}
									</button>
									<button className="button__arrow" onClick={()=>handleKeyDown(40)}>
										v
									</button>
									<button className="button__arrow" onClick={()=>handleKeyDown(39)}>
										{">"}
									</button>
								</div>
							</div>
							<p>이동하기</p>
						</div>
					</div>

					{/* 작은창에서의 점수판 */}
					<div className="container__score__bottom">
						<div className={nowTurn === firstTeamIdx ? "score__highlight" : "score__bg"}>
							<img className="icon__cat" src={icon_cat} alt="고양이" />
							<div>{scores[0]}</div>
						</div>
						<div className={nowTurn === firstTeamIdx+1 ? "score__highlight" : "score__bg"}>
							<div>{scores[1]}</div>
							<img className="icon__dog" src={icon_dog} alt="강아지" />
						</div>
					</div>
				</div>

				{/* 강아지 */}
				<div className="container__bgImage">
					<div className={nowTurn === firstTeamIdx+1 ? "score__highlight" : "score__bg"}>
						<div>{scores[1]}</div>
					</div>
					<img className="image__dog" src={dog} alt="강아지" />
					<div className="logo__redBox" />
				</div>
			</div>
		)
	}
}

export default Game;