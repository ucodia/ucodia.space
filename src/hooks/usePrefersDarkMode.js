import { useState, useEffect } from "react";
const prefersDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

const usePrefersDarkMode = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState(
    prefersDarkModeQuery.matches
  );
  useEffect(() => {
    const handleQuery = ({ matches }) => setPrefersDarkMode(matches);
    prefersDarkModeQuery.addListener(handleQuery);
    return () => {
      prefersDarkModeQuery.removeListener(handleQuery);
    };
  });

  return prefersDarkMode;
};

export default usePrefersDarkMode;
