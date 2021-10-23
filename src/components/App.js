import React from "react";
import { Switch, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import Home from "./Home";
import apps from "../apps";

const App = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      {Object.keys(apps).map((appKey) => {
        return (
          <Route
            key={appKey}
            path={`/${appKey}`}
            component={() => <FullScreen>{apps[appKey]}</FullScreen>}
          />
        );
      })}
    </Switch>
  );
};

export default App;
