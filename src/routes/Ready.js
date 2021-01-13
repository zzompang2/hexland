import React from "react";
import { Link } from 'react-router-dom';
import Navigation from "../components/Navigation";
import "./Ready.css";
import icon_cat from "../images/icon_cat.png";
import icon_dog from "../images/icon_dog.png";

const mapLength = {width: 400, height: 400};
const firstTeamIdx = 1;

const indexObj = {
	noOwner: 0,
	firstTeamIdx: 1,
	mark: 3,
	background: 4,
	firstBlock: 5
};

class Ready extends React.Component {
	state = {
		playerNum: 0,
		firstTurn: 0,
		mapSize: {x: 0, y: 0}
	}

	setPlayerNum = (num) => {
		this.setState({ playerNum: num });
	}

	setCharacter = (idx) => {
		this.setState({ firstTurn: idx });
	}

	setMapSize = (size) => {
		this.setState({ mapSize: {x: size, y: size}});
	}

	render() {
		const {playerNum, firstTurn, mapSize} = this.state;
		const {
			setPlayerNum,
			setCharacter,
			setMapSize
		} = this;

		return (
			// 게임 순서 정하기
			<div className="container__beforeStart">
				<Navigation />
				<div className="container__choices">
					<p className="question">플레이어 수</p>
					<p className="question__comment">{playerNum !== 2 ? "1명을 선택하면 알고리즘과 대결합니다." : "2명이서 번갈아 가며 즐길 수 있는 모드입니다."}</p>
					<div className="container__choice">
						<div className={playerNum === 1 ? "choice__mark" : "choice"} onClick={()=>setPlayerNum(1)}>1명</div>
						<div className={playerNum === 2 ? "choice__mark" : "choice"} onClick={()=>setPlayerNum(2)}>2명</div>
					</div>
					<p className="question">캐릭터 선택</p>
					<p className="question__comment">{playerNum !== 2 ? "맘에 드는 캐릭터를 선택하세요." : "2명이 즐기는 모드인 경우, 선택한 캐릭터 부터 게임을 시작합니다."}</p>
					<div className="container__choice">
						<div className={firstTurn === firstTeamIdx ? "choice__mark" : "choice"} onClick={()=>setCharacter(firstTeamIdx)}>
							<img className="choice__cat" src={icon_cat} alt="고양이" />
							<p>고양이</p>
						</div>
						<div className={firstTurn === firstTeamIdx+1 ? "choice__mark" : "choice"} onClick={()=>setCharacter(firstTeamIdx+1)}>
							<img className="choice__dog" src={icon_dog} alt="강아지" />
							<p>강아지</p>
						</div>
					</div>
					<p className="question">방 크기</p>
					<p className="question__comment">맵이 작을수록 서로 견제가 더 심해집니다.</p>
					<div className="container__choice">
						<div className={mapSize.x === 10 ? "choice__mark" : "choice"} onClick={()=>setMapSize(10)}>10x10</div>
						<div className={mapSize.x === 16 ? "choice__mark" : "choice"} onClick={()=>setMapSize(16)}>16x16</div>
						<div className={mapSize.x === 20 ? "choice__mark" : "choice"} onClick={()=>setMapSize(20)}>20x20</div>
					</div>
					<div className="button__gamestart">
						{playerNum !== 0 && firstTurn !== 0 && mapSize.x !== 0 ?
						<Link
						to={{
							pathname: "/game",
							state: {
								playerNum,
								nowTurn: firstTurn,
								firstTeamIdx,
								mapLength,
								mapSize,
								indexObj
							}
							}}>
								<p>게임 시작!</p>
						</Link>
						:
						null
						}
					</div>
				</div>
			</div>
		)
	}
}

export default Ready;