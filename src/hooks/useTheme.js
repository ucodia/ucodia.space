import { defaultTheme, darkTheme } from "../themes";
import { useState, useEffect } from "react";

const isDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

export default () => {
  const [theme, setTheme] = useState(
    isDarkModeQuery.matches ? darkTheme : defaultTheme
  );
  useEffect(() => {
    const handleColorScheme = ({ matches }) => {
      setTheme(matches ? darkTheme : defaultTheme);
    };
    isDarkModeQuery.addListener(handleColorScheme);

    return () => {
      isDarkModeQuery.removeListener(handleColorScheme);
    };
  });

  return theme;
};
