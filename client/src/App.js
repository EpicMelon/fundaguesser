import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Game from "./components/Game";
import Menu from "./components/Menu";

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={Menu} />
          <Route exact path="/:roomId" component={Game} />
        </Switch>
      </Router>
  );
}

export default App;
