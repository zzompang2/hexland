import { HashRouter, Route } from "react-router-dom";
import Home from "./routes/Home";
import Game from "./routes/Game";

function App() {
  return (
    <HashRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/game" component={Game} />
    </HashRouter>
  );
}

export default App;
