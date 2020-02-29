import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../theme";

const AppContext = ({ children }) => {
  return (
    <Router>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Router>
  );
};

export default AppContext;
