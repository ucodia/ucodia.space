import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { defaultTheme, darkTheme } from "../themes";
import usePrefersDarkMode from "../hooks/usePrefersDarkMode";

const AppContext = ({ children }) => {
  const prefersDarkMode = usePrefersDarkMode();
  const theme = prefersDarkMode ? darkTheme : defaultTheme;

  return (
    <Router>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Router>
  );
};

export default AppContext;
