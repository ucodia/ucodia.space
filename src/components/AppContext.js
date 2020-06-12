import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import useTheme from "../hooks/useTheme";

const AppContext = ({ children }) => {
  const theme = useTheme();

  return (
    <Router>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Router>
  );
};

export default AppContext;
