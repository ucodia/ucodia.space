import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ReactGA from "react-ga";

const RouterAnalytics = ({ gaTrackingId, children }) => {
  const { listen } = useHistory();
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    ReactGA.initialize(gaTrackingId);
    ReactGA.pageview(window.location.pathname + window.location.search);
    const unlisten = listen(location => {
      ReactGA.pageview(location.pathname + location.search);
    });
    return unlisten;
  });

  return children;
};

export default RouterAnalytics;
