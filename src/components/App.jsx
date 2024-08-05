import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme";
import Page from "./Page";
import Home from "./Home";
import Alert from "./Alert";
import routes from "@/routes";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
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
          {routes.map(({ path, element }, i) => {
            return <Route key={path} path={path} element={element} />;
          })}
          <Route
            path="*"
            element={
              <Page title="404">
                <div className="w-screen h-screen flex items-center justify-center">
                  <Alert title="404">
                    <p>Ceci n'est pas une page.</p>
                  </Alert>
                </div>
              </Page>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
