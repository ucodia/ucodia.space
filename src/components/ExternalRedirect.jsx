import React, { useEffect } from "react";

const ExternalRedirect = ({ to, httpCode = 302 }) => {
  useEffect(() => {
    document.location.status = httpCode;
    window.location.replace(to);
  }, [to, httpCode]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Redirecting to external page...</p>
    </div>
  );
};

export default ExternalRedirect;
