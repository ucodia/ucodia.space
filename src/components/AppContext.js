import React, { useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { defaultTheme, darkTheme } from "../themes";
import usePrefersDarkMode from "../hooks/usePrefersDarkMode";
import RouterAnalytics from "./RouterAnalytics";
import { IS_PROD } from "../utils/constants";

const AppContext = ({ children }) => {
  const isDarkMode = usePrefersDarkMode();
  const theme = useMemo(() => (isDarkMode ? darkTheme : defaultTheme), [
    isDarkMode
  ]);

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
