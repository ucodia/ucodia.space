import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import u5 from "u5js";
import Alert from "./Alert";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

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

  return <Container ref={containerRef} />;
};

export default U5Wrapper;
