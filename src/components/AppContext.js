import React, { useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { defaultTheme, darkTheme } from "../themes";
import usePrefersDarkMode from "../hooks/usePrefersDarkMode";

const AppContext = ({ children }) => {
  const isDarkMode = usePrefersDarkMode();
  const theme = useMemo(() => (isDarkMode ? darkTheme : defaultTheme), [
    isDarkMode
  ]);

  return (
    <Router>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Router>
  );
};

export default AppContext;
