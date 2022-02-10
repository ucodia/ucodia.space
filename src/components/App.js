import React from "react";
import { Routes, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import Page from "./Page";
import Home from "./Home";
import NotFound from "./NotFound";
import apps from "../apps";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          <Page title="You're Home">
            <Home />
          </Page>
        }
      />
      {Object.keys(apps).map((appKey) => {
        return (
          <Route
            key={appKey}
            path={`/${appKey}`}
            element={
              <Page title={appKey}>
                <FullScreen>{apps[appKey]}</FullScreen>
              </Page>
            }
          />
        );
      })}
      <Route
        path="*"
        element={
          <Page title="404">
            <FullScreen>
              <NotFound />
            </FullScreen>
          </Page>
        }
      />
    </Routes>
  );
};

export default App;
