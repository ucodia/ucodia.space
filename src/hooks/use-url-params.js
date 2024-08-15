import React from "react";
import { useLocation } from "react-router-dom";

export default function useURLParams() {
  const { search } = useLocation();
  return React.useMemo(
    () => Object.fromEntries(new URLSearchParams(search).entries()),
    [search]
  );
}
