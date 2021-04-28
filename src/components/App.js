import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import FullScreen from "./FullScreen";
import RandomApp from "./RandomApp";
import Home from "./Home";

const GoToHEN = () => {
  useEffect(() => {
    window.location =
      "https://www.hicetnunc.xyz/tz/tz1cMugfiPv184Dw6PUhai78dTnzvPx9jnDy";
  }, []);
  return <div>Redirecting to Hic et Nunc...</div>;
};

const App = () => {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route
        path="/hen"
        exact
        component={() => (
          <FullScreen>
            <GoToHEN />
          </FullScreen>
        )}
      />
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
