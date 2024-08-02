import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme";
import Page from "./Page";
import Home from "./Home";
import Alert from "./Alert";
import pages from "../pages";

const FullScreen = ({ children }) => (
  <div className="w-screen h-screen flex items-center justify-center">
    {children}
  </div>
);

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
                  <Alert title="404">
                    <p>Ceci n'est pas une page.</p>
                  </Alert>
                </FullScreen>
              </Page>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
