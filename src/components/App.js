import React from "react";
import { Switch, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import NotFound from "./NotFound";
import Home from "./Home";
import apps from "../apps";

const App = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      {Object.keys(apps).map((appKey) => {
        return (
          <Route key={appKey} path={`/${appKey}`}>
            <FullScreen>{apps[appKey]}</FullScreen>
          </Route>
        );
      })}
      <Route path="*">
        <FullScreen>
          <NotFound />
        </FullScreen>
      </Route>
    </Switch>
  );
};

export default App;
