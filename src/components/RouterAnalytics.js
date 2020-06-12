import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const RouterAnalytics = ({ gaMeasurementId, children }) => {
  const { listen } = useHistory();
  useEffect(() => {
    const unlisten = listen(location => {
      if (process.env.NODE_ENV === "development" || !window.gtag) return;
      window.gtag("config", gaMeasurementId, { page_path: location.pathname });
    });
    return unlisten;
  });

  return children;
};

export default RouterAnalytics;
