import { HashRouter, Route } from "react-router-dom";
import Home from "./routes/Home";
import Intro from "./routes/Intro";
import Ready from "./routes/Ready";
import Game from "./routes/Game";
import "./App.css"

function App() {
  return (
    <HashRouter>
      <Route exact path="/" component={Home} />
      <Route path="/intro" component={Intro} />
      <Route path="/ready" component={Ready} />
      <Route path="/game" component={Game} />
    </HashRouter>
  );
}

export default App;
