import React from "react";
import { Switch, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import RandomApp from "./RandomApp";
import Conundrums from "../apps/Conundrums";

const App = () => {
  return (
    <Switch>
      <Route path="/conundrums" component={() => <Conundrums />} />
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
