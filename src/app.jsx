import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme";
import Page from "@/components/page";
import Alert from "@/components/alert";
import Home from "@/pages/home";
import routes from "@/routes";
import { MDXProvider } from "@mdx-js/react";
import ExternalLink from "./components/external-link";

const components = {
  a: ExternalLink,
};

const App = () => {
  return (
    <ThemeProvider>
      <MDXProvider components={components}>
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
