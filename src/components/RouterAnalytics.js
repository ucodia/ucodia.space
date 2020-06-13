import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const RouterAnalytics = ({ gaTrackingId, children }) => {
  const location = useLocation();

  useEffect(() => {
    console.log("ReactGA.initialize", gaTrackingId);
    ReactGA.initialize(gaTrackingId);
  }, [gaTrackingId]);

  useEffect(() => {
    console.log("ReactGA.pageview", location);
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return children;
};

export default RouterAnalytics;
