import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme";
import Page from "@/components/Page";
import Alert from "@/components/Alert";
import Home from "@/pages/Home";
import routes from "@/routes";
import { MDXProvider } from "@mdx-js/react";

const App = () => {
  return (
    <ThemeProvider>
      <MDXProvider>
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
            {routes.map(({ path, name, element }, i) => {
              return (
                <Route
                  key={path}
                  path={path}
                  element={<Page title={name}>{element}</Page>}
                />
              );
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
      </MDXProvider>
    </ThemeProvider>
  );
};

export default App;
