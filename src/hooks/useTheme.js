import { light, dark } from "../themes";
import { useState, useEffect } from "react";

const isDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const darkIfTrue = isDark => (isDark ? dark : light);

export default () => {
  const [theme, setTheme] = useState(darkIfTrue(isDarkModeQuery.matches));
  useEffect(() => {
    const handleColorScheme = ({ matches }) => {
      setTheme(darkIfTrue(matches));
    };
    isDarkModeQuery.addListener(handleColorScheme);

    return () => {
      isDarkModeQuery.removeListener(handleColorScheme);
    };
  });

  return theme;
};
