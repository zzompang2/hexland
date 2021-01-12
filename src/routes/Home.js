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
				<img className="image__logo" src={logo} alt="로고" />
				<div className="container__row">
					<img className="image__cat" src={cat} alt="고양이" />
					<div className="container__links">
						<Link
							className="home__link"
							to={{pathname: "/game"}} >
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
					<img className="image__dog" src={dog} alt="강아지" />
				</div>
			</div>
		)
	}
}

export default Home;