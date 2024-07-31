import React, { useEffect, useRef, useState } from "react";
import u5 from "u5js";
import Alert from "./Alert";

const U5Wrapper = ({ sketch }) => {
  const [error, setError] = useState(undefined);
  const containerRef = useRef(null);
  useEffect(() => {
    try {
      const u5Instance = new u5(sketch, containerRef.current);
      setError(undefined);
      return () => u5Instance.remove();
    } catch (error) {
      setError(error);
    }
  }, []);

  if (error) {
    return (
      <Alert title="Ouch!">
        <p>There was an error initializing this sketch.</p>
        <pre>{error.message}</pre>
      </Alert>
    );
  }

  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default U5Wrapper;
