import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import u5 from "u5js";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const U5Wrapper = ({ sketch }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    const u5Instance = new u5(sketch, containerRef.current);
    return () => u5Instance.remove();
  }, []);

  return <Container ref={containerRef} />;
};

export default U5Wrapper;
