import React from "react";
import { Switch, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import RandomApp from "./RandomApp";

const App = () => {
  return (
    <Switch>
      <Route
        path="/:appId?"
        component={() => (
          <FullScreen>
            <RandomApp />
          </FullScreen>
        )}
      />
    </Switch>
  );
};

export default App;
