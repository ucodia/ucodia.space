import React from "react";
import { Switch, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import Page from "./Page";
import Home from "./Home";
import NotFound from "./NotFound";
import apps from "../apps";

const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Page title="You're Home">
          <Home />
        </Page>
      </Route>
      {Object.keys(apps).map((appKey) => {
        return (
          <Route key={appKey} path={`/${appKey}`}>
            <Page title={appKey}>
              <FullScreen>{apps[appKey]}</FullScreen>
            </Page>
          </Route>
        );
      })}
      <Route path="*">
        <Page title="404">
          <FullScreen>
            <NotFound />
          </FullScreen>
        </Page>
      </Route>
    </Switch>
  );
};

export default App;
