import React from "react";
import { Link } from 'react-router-dom';

class Home extends React.Component {
	render() {
		return (
			<div className="container">
				<div>육각형 땅따먹기 (Hex Land)</div>
				<Link
					to={{pathname: "/game"}} >
					게임 시작
				</Link>
			</div>
		)
	}
}

export default Home;