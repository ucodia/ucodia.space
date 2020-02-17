import React from "react";
import { Switch, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import RandomSketch from "./RandomApp";

const App = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        component={() => (
          <FullScreen>
            <RandomSketch />
          </FullScreen>
        )}
      />
    </Switch>
  );
};

export default App;
