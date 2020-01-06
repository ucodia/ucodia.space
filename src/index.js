import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { debounce } from "lodash";
import configureStore from "./store";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import setViewportVariables from "./utils/setViewportVariables";

const StyleReset = createGlobalStyle`
  body {
    margin: 0;
    font-family: monospace;
  }
`;

// define and update viewport CSS variable
setViewportVariables();
window.addEventListener("resize", debounce(setViewportVariables, 400));

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <>
        <StyleReset />
        <App />
      </>
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
