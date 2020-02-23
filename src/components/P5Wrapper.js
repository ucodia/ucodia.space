import React, { useRef, useEffect, useState } from "react";
import p5 from "p5";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const P5Wrapper = ({ sketch }) => {
  const [, setP5Instance] = useState(null);
  const p5Container = useRef(null);
  useEffect(() => {
    if (p5Container.current) {
      const newP5Instance = new p5(sketch, p5Container.current);

      // prevent scrolling on mobile
      p5Container.current.addEventListener("touchmove", event =>
        event.preventDefault()
      );

      setP5Instance(newP5Instance);
    }
  }, [sketch]);

  return <Container ref={p5Container} />;
};

export default P5Wrapper;
