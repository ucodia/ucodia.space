import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import configureStore from "./store";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

const StyleReset = createGlobalStyle`
  body {
    margin: 0;
    font-family: monospace;
  }
`;

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
