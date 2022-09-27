import React from "react";
import { Routes, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import Page from "./Page";
import Home from "./Home";
import NotFound from "./NotFound";
import pages from "../pages";

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
      {Object.keys(pages).map((page) => {
        return (
          <Route
            key={page}
            path={`/${page}`}
            element={
              <Page title={page}>
                <FullScreen>{pages[page]}</FullScreen>
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
