import React from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import P5Wrapper from "./P5Wrapper";
import sketches from "../sketches";

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        component={() => (
          <FullScreen>
            <P5Wrapper sketch={sketches.diamonds} />
          </FullScreen>
        )}
      />
      <Route
        exact
        path="/circuits"
        component={() => (
          <FullScreen>
            <P5Wrapper sketch={sketches.circuits} />
          </FullScreen>
        )}
      />
      <Route
        exact
        path="/nightshifting"
        component={() => (
          <FullScreen>
            <P5Wrapper sketch={sketches.nightshifting} />
          </FullScreen>
        )}
      />
    </Switch>
  );
};

export default App;
