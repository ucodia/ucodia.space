import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { defaultTheme, darkTheme } from "../themes";
import usePrefersDarkMode from "../hooks/usePrefersDarkMode";
import RouterAnalytics from "./RouterAnalytics";
import { IS_PROD } from "../utils/constants";

const AppContext = ({ children }) => {
  const prefersDarkMode = usePrefersDarkMode();
  const theme = prefersDarkMode ? darkTheme : defaultTheme;

  return (
    <Router>
      {IS_PROD ? (
        <RouterAnalytics gaTrackingId="UA-159366089-1">
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </RouterAnalytics>
      ) : (
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      )}
    </Router>
  );
};

export default AppContext;
