import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router } from "react-router-dom";
import "typeface-work-sans";
import App from "./components/App";
import setViewportVariables from "./utils/setViewportVariables";
import debounce from "./utils/debounce";

const StyleReset = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Work Sans', sans-serif;
  }
`;

// define and update viewport CSS variable
setViewportVariables();
window.addEventListener("resize", debounce(setViewportVariables, 400));

const Root = () => (
  <>
    <StyleReset />
    <Router>
      <App />
    </Router>
  </>
);

const container = document.getElementById("root");
if (container.hasChildNodes()) {
  hydrateRoot(container, <Root />);
} else {
  const root = createRoot(container);
  root.render(<Root />);
}
