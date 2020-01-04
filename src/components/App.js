import React from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Diamonds from "./Diamonds";

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
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
            <Diamonds />
          </FullScreen>
        )}
      />
    </Switch>
  );
};

export default App;
