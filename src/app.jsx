import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Page title="You're Home">
        <Home />
      </Page>
    ),
    errorElement: (
      <Page title="404">
        <div className="w-screen h-screen flex items-center justify-center">
          <Alert title="404">
            <p>Ceci n'est pas une page.</p>
          </Alert>
        </div>
      </Page>
    ),
  },
  ...routes.map(({ name, path, element }) => ({
    path,
    element: <Page title={name}>{element}</Page>,
  })),
]);

const App = () => {
  return (
    <ThemeProvider>
      <MDXProvider components={components}>
        <RouterProvider router={router} />
      </MDXProvider>
    </ThemeProvider>
  );
};

export default App;
