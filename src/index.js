import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import debounce from "lodash/debounce";
import AppContext from "./components/AppContext";
import App from "./components/App";
import setViewportVariables from "./utils/setViewportVariables";
import "typeface-work-sans";

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
  <AppContext>
    <>
      <StyleReset />
      <App />
    </>
  </AppContext>
);
const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(<Root />, rootElement);
} else {
  ReactDOM.render(<Root />, rootElement);
}
