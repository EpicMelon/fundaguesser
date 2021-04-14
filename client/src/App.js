import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Room from "./components/Room";
import Menu from "./components/Menu";

import "./css/new/root.css"

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/" component={Menu} />
          <Route exact path="/:roomId" component={Room} />
        </Switch>
      </Router>
  );
}

export default App;
