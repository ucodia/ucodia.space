import React from "react";
import { Switch, Route } from "react-router-dom";
import RandomSketch from "./RandomSketch";

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={RandomSketch} />
    </Switch>
  );
};

export default App;
