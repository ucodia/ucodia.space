import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import Exp from "./Exp";

const App = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/exp" component={Exp} />
    </Switch>
  );
};

export default App;
