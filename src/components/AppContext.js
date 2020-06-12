import React, { useMemo } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { defaultTheme, darkTheme } from "../themes";
import usePrefersDarkMode from "../hooks/usePrefersDarkMode";
import RouterAnalytics from "./RouterAnalytics";

const AppContext = ({ children }) => {
  const isDarkMode = usePrefersDarkMode();
  const theme = useMemo(() => (isDarkMode ? darkTheme : defaultTheme), [
    isDarkMode
  ]);

  return (
    <Router>
      <RouterAnalytics gaMeasurementId="G-EDLD5QYYPN">
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </RouterAnalytics>
    </Router>
  );
};

export default AppContext;
