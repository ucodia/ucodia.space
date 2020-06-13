import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const RouterAnalytics = ({ gaTrackingId, children }) => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(gaTrackingId);
  }, [gaTrackingId]);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return children;
};

export default RouterAnalytics;
