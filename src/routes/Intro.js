import React from "react";
import { Link } from 'react-router-dom';
import Navigation from "../components/Navigation";
import "./Intro.css";
import page1 from "../images/explain_1.png";
import page2 from "../images/explain_2.png";
import page3 from "../images/explain_3.png";
import page4 from "../images/explain_4.png";

const pages = [
	page1, page2, page3, page4
];

class Intro extends React.Component {
	state = {
		curPage: 0
	}

	changePage = (page) => {
		const { history } = this.props;

		if(page < 0)
			history.push("/");
		else if(page === pages.length)
			history.push("/ready");
		else
			this.setState({ curPage: page });
	}

	render() {
		const { curPage } = this.state;
		const {
			changePage
		} = this;

		return (
			<div className="container__intro">
				<Navigation />
				<img className="page" src={pages[curPage]} alt="게임설명" />
				<div className="container__pageButton">
					<button onClick={()=>changePage(curPage-1)}><p>이전</p></button>
					<button onClick={()=>changePage(curPage+1)}><p>{curPage + 1 === pages.length ? "게임시작" : "다음"}</p></button>
				</div>
			</div>
		)
	}
}

export default Intro;