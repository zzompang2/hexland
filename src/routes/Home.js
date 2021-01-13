import React from "react";
import { Link } from 'react-router-dom';
import "./Home.css";
import logo from "../images/logo.png";
import cat from "../images/bg_cat.png";
import dog from "../images/bg_dog.png";

class Home extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="container__bgImage">
					<img className="bg__cat" src={cat} alt="고양이" />
					<div className="bg__blueBox" />
				</div>
				<div className="container__column">
					<div className="logo__whiteBox" />
					<img className="image__logo" src={logo} alt="로고" />
					<div className="container__link">
						<Link
							className="home__link"
							to={{pathname: "/ready"}} >
							게임 시작
						</Link>
						<Link
							className="home__link"
							to={{pathname: "/"}} >
							게임 소개
						</Link>
						<Link
							className="home__link"
							to={{pathname: "/"}} >
							만든이
						</Link>
					</div>
					<div className="container__bgImage__small">
						<img className="bg__cat" src={cat} alt="고양이" />
						<img className="bg__dog" src={dog} alt="강아지" />
					</div>
				</div>
				<div className="container__bgImage">
					<img className="bg__dog" src={dog} alt="강아지" />
					<div className="bg__redBox" />
				</div>
			</div>
		)
	}
}

export default Home;