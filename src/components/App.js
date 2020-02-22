import React from "react";
import { Switch, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import RandomApp from "./RandomApp";
import Conundrum from "../apps/Conundrum";

const App = () => {
  return (
    <Switch>
      <Route path="/conundrum" component={() => <Conundrum />} />
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
