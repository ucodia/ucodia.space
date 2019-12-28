import React from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";

const FullScreen = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  text-align: center;
  font-size: 4rem;
`;

const App = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        component={() => (
          <FullScreen>
            <Title>
              <p>UCODIA</p>
              <p>SPACE</p>
              <span>🚀</span>
            </Title>
          </FullScreen>
        )}
      />
    </Switch>
  );
};

export default App;
